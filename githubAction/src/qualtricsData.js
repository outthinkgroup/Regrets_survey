require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
var StreamZip = require("node-stream-zip");
const { mergeData } = require("./resultsmerger");
const demoFile = require("./../../data/data.json"); //!this is for restarting fresh

const TOKEN = process.env.QUALTRICS_TOKEN;
const SURVEY = process.env.SURVEY_ID;
const RAW_DATA_NAME = "rawData";
const CLEAN_DATA_NAME = "data";
const IP_STACK_KEY = process.env.IP_STACK_KEY;
//THIS IS ONLY SHOWS RESULTS THAT HAVE IP AND ARE AFTER JUNE 19
const FILTER = `ebc97c57-062f-4cc2-8724-af4fe73d7b01`;

//* THIS INITS THE WHOLE PROCESS
//? ----
const qualtricsData = ({ token, surveyId, ipStackKey, oldData }) =>
  getResponses(
    {
      filterId: FILTER,
      limit: 100,
    },
    oldData,
    {
      token,
      surveyId,
      ipStackKey,
    }
  );
//?---
//*

//REBUILD DATA
//dont forget to uncomment saving tofile system
/* qualtricsData({
  token: TOKEN,
  surveyId: SURVEY,
  ipStackKey: IP_STACK_KEY,
  oldData: demoFile,
}); */

async function getResponses(exportOptions = {}, oldData, config) {
  //create data directory
  //await createDir("data");
  await createDir("rawData");

  //start export
  const progress = await startExport(exportOptions, config);
  if (hasError(progress)) return;
  const { progressId } = progress.result;

  //query for progress
  const fileId = await getProgress(progressId, config);
  console.log("fileId", fileId);

  //save results to json file
  await getResults(fileId, config);

  //read file
  const rawData = readFile(`rawData/${RAW_DATA_NAME}.json`);

  //Clean data
  const data = await mergeData({ newData: rawData, oldData: {}, config });
  //const json = JSON.stringify(data);
  //saveToFileSystem({ results: json });
  //console.log(data);
  return data;
}

function startExport(options = {}, config) {
  const { token, surveyId } = config;

  const myHeaders = {
    "X-API-TOKEN": token,
    "Content-Type": "application/json",
  };
  var body = JSON.stringify({ format: "json", ...options });
  console.log(body);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
    redirect: "follow",
  };

  return fetch(
    `https://co1.qualtrics.com/API/v3/surveys/${surveyId}/export-responses/`,
    requestOptions
  )
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.log("error", error));
}

async function getProgress(progressId, config) {
  const { token, surveyId } = config;

  const myHeaders = {
    "X-API-TOKEN": token,
    "Content-Type": "application/json",
  };

  const getRequestId = async () => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const data = await fetch(
      `https://co1.qualtrics.com/API/v3/surveys/${surveyId}/export-responses/${progressId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log("error", error));

    if (hasError(data)) return;

    const { percentComplete, fileId } = data.result;
    console.log(percentComplete);
    if (percentComplete !== 100.0) {
      return getRequestId();
    } else {
      return fileId;
    }
  };

  const fileId = await getRequestId();

  return fileId;
}

async function getResults(fileId, config) {
  const { token, surveyId } = config;

  const headers = {
    "X-API-TOKEN": token,
    "accept-charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3",
    "accept-language": "en-US,en;q=0.8",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
    "accept-encoding": "gzip,deflate",
  };
  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  return fetch(
    `https://co1.qualtrics.com/API/v3/surveys/${surveyId}/export-responses/${fileId}/file`,
    requestOptions
  )
    .then((res) => {
      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(
          `rawData/${RAW_DATA_NAME}.zip`
        );

        res.body.pipe(writeStream).on("finish", (err) => {
          if (err) return reject(err);
          else resolve();
        });
      });
    })
    .then(() => unzip(`rawData/${RAW_DATA_NAME}.zip`))
    .catch((error) => console.log("error", error));
}

function unzip(file) {
  const zip = new StreamZip({
    file: file,
    storeEntries: true,
  });

  return new Promise((resolve, reject) => {
    zip.on("error", function(err) {
      console.error("[ERROR]", err);
      reject();
    });

    zip.on("ready", function() {
      console.log("All entries read: " + zip.entriesCount);
    });

    zip.on("entry", function(entry) {
      console.log("[FILE]", entry.name);
      //
      zip.stream(entry.name, function(err, stream) {
        if (err) {
          console.error("Error:", err.toString());
          return;
        }
        //
        stream.on("error", function(err) {
          console.log("[ERROR]", err);
          return;
        });
        //
        stream.pipe(fs.createWriteStream(`rawData/${RAW_DATA_NAME}.json`));
        //
        stream.on("end", function() {
          resolve();
        });
      });
    });
  });
}

function readFile(file) {
  const contents = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
  const data = JSON.parse(contents);

  return data;
}

async function cleanData(data, config) {
  return Promise.all(
    data.responses.map(
      (response) =>
        new Promise((resolve, reject) => {
          const { values, labels } = response;
          const { ipAddress } = values;
          if (labels.QID5) {
            const { QID4: country, QID5: state } = labels;
            resolve({
              regret: values.QID1_TEXT || "",
              gender: labels.QID2 || "",
              location: { country, state },
              date: values.endDate,
            });
          }
          getLocationFromIP(ipAddress, config).then((res) => {
            const { country, state } = res;
            const location = { country, state };
            resolve({
              regret: values.QID1_TEXT || "",
              gender: labels.QID2 || "",
              location,
              date: values.endDate,
            });
          });
        })
    )
  );
}

function saveToFileSystem(data) {
  const dataString = JSON.stringify(data);
  fs.writeFileSync(`data/${CLEAN_DATA_NAME}.json`, dataString);
}

function createDir(dirname) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirname, (err) => {
      if (err && err.code !== "EEXIST") {
        reject();
      }
      resolve();
    });
  });
}

function hasError(data) {
  if (data.meta.error) {
    console.log(data.meta.error);
  }
}

//This is just for Results that have ip address and not Country/State

module.exports = {
  getResults,
  qualtricsData,

  saveToFileSystem,
};
