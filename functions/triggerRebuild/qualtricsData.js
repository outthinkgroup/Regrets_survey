require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
//ENV vars

const { mergeData } = require("./resultsmerger");
// const demoFile = require("./../../data/data.json"); //!this is for restarting fresh
const { getLastWeekISO } = require("./helpers");
const errMsgs = [];

//* THIS INITS THE WHOLE PROCESS
//? ----
/**
 *
 * @param {{
 * token: string,
 * surveyId: string,
 * oldData:Object,
 * exportOptions:object - not required
 * }} qualtricsDataOptions
 * @returns
 */
const qualtricsData = ({ token, surveyId, oldData, exportOptions = {} }) =>
  getResponses(exportOptions, oldData, {
    token,
    surveyId,
  }).catch((e) => console.log(e));
//?---
//*

//REBUILD DATA
// qualtricsData({
//   token: TOKEN,
//   surveyId: SURVEY,
//   oldData: demoFile,
// }).then(function(res) {
//   fs.writeFile(
//     "./../../data/tdata.json",
//     JSON.stringify(res, null, 2),
//     { encoding: "utf8" },
//     () => console.log("done")
//   );
// });

/**
 * @param {Object} exportOptions - options to send to qualtrics to get the correct data
 * @param {Object} oldData - previous data
 * @param {Object} config - ENV vars
 * @returns
 */
async function getResponses(exportOptions, oldData, config) {
  console.log("ran");
  console.log(config);
  const freshData = {};

  //start export
  const progress = await startExport(exportOptions, config);
  if (hasError(progress)) return;
  const { progressId } = progress.result;

  //query for progress
  const { fileId } = await getProgress(progressId, config);

  //get the results in json
  const rawData = await getJsonResults(fileId, config);

  // Clean data
  const data = await mergeData({
    newData: rawData,
    oldData,
    config,
  }).catch((e) => errMsgs.push({ mergeData: e }));
  freshData.results = data;

  return { data: freshData, q_errors: errMsgs };
}
//TODO test the start date fn, see if it pulls in results correctly
//TODO make a local endpoint that saves data to filesystem not github
function startExport(userOptions, config) {
  const { token, surveyId } = config;

  const myHeaders = {
    "X-API-TOKEN": token,
    "Content-Type": "application/json",
  };
  const defaultOptions = {
    format: "json",
    compress: false,
    limit: 1000,
    startDate: getLastWeekISO(),
    filterId: undefined,
  };
  const exportOptions = {
    ...defaultOptions,
    ...userOptions,
  };
  var body = JSON.stringify(exportOptions);

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
  console.log(token);
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
      return { fileId };
    }
  };

  const { fileId } = await getRequestId();

  return { fileId };
}

async function getJsonResults(fileId, config) {
  const { token, surveyId } = config;
  const myHeaders = {
    "X-API-TOKEN": token,
    "Content-Type": "application/json",
  };
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return fetch(
    `https://co1.qualtrics.com/API/v3/surveys/${surveyId}/export-responses/${fileId}/file`,
    requestOptions
  ).then((res) => {
    return res.json();
  });
}

function hasError(data) {
  if (data.meta.error) {
    console.log(data.meta.error);
  }
}

module.exports = {
  qualtricsData,
};
