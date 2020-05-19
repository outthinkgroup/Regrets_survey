require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
var StreamZip = require("node-stream-zip");

const TOKEN = process.env.QUALTRICS_TOKEN;
const SURVEY = process.env.SURVEY_ID;

const myHeaders = {
  "X-API-TOKEN": TOKEN,
  "Content-Type": "application/json",
};

//getResponses();
async function getResponses() {
  //start export
  const progress = await startExport();
  if (hasError(progress)) return;

  const { progressId } = progress.result;

  //query for progress
  const fileId = await getProgress(progressId);
  console.log("fileId", fileId);

  //save results
  const results = await getResults(fileId);
  console.log("results", results);
}

function startExport() {
  var raw = JSON.stringify({ format: "json" });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    `https://co1.qualtrics.com/API/v3/surveys/${SURVEY}/export-responses/`,
    requestOptions
  )
    .then((response) => response.json())
    .then((res) => res)
    .catch((error) => console.log("error", error));
}

async function getProgress(progressId) {
  const getRequestId = async () => {
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const data = await fetch(
      `https://co1.qualtrics.com/API/v3/surveys/${SURVEY}/export-responses/${progressId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log("error", error));

    if (hasError(data)) return;

    const { percentComplete, fileId } = data.result;

    if (percentComplete !== 100.0) {
      return getRequestId();
    } else {
      return fileId;
    }
  };

  const fileId = await getRequestId();

  return fileId;
}

async function getResults(fileId) {
  const headers = {
    "X-API-TOKEN": TOKEN,
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
    `https://co1.qualtrics.com/API/v3/surveys/${SURVEY}/export-responses/${fileId}/file`,
    requestOptions
  )
    .then((res) => {
      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream("data.zip");

        res.body.pipe(writeStream).on("finish", (err) => {
          if (err) return reject(err);
          else resolve();
        });
      });
    })
    .then(() => {
      return unzip("data.zip").then(() => readFile("data.json"));
    })
    .then((res) => res)
    .catch((error) => console.log("error", error));
}

function hasError(data) {
  if (data.meta.error) {
    console.log(data.meta.error);
  }
}

function unzip(file) {
  var zip = new StreamZip({
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
        stream.pipe(fs.createWriteStream("data.json"));
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

  const regrets = data.responses.map((response) => {
    const { values, labels } = response;
    const { ipAddress } = values;
    const { QID4: country, QUID5: state } = labels;
    const location = ipAddress ? { ipAddress } : { country, state };
    return {
      regret: values.QID1_TEXT || "",
      gender: labels.QID2 || "",
      location,
    };
  });

  return regrets;
}
