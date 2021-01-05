require("dotenv").config();
// const fs = require("fs");
const fetch = require("node-fetch");

console.log(repo, surveyId);
const { mergeData } = require("./resultsmerger");
//const demoFile = require("./../../data/data.json"); //!this is for restarting fresh

const TOKEN = process.env.QUALTRICS_TOKEN;
const SURVEY = process.env.SURVEY_ID;
const IP_STACK_KEY = process.env.IP_STACK_KEY;
const errMsgs = [];
//* THIS INITS THE WHOLE PROCESS
//? ----
const qualtricsData = ({ token, surveyId, ipStackKey, oldData }) =>
  getResponses({}, oldData, {
    token,
    surveyId,
    ipStackKey,
  }).catch((e) => console.log(e));
//?---
//*

//REBUILD DATA
//dont forget to uncomment saving tofile system
// qualtricsData({
//   token: qualtricsToken,
//   ipStackKey,
//   surveyId,
//   oldData: {},
// }).then(function(res) {
//   fs.writeFile(
//     "./../../data/data.json",
//     JSON.stringify(res, null, 2),
//     { encoding: "utf8" },
//     () => console.log("done")
//   );
// });

async function getResponses(exportOptions = {}, oldData, config) {
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

function startExport(options = {}, config) {
  const { token, surveyId } = config;

  const myHeaders = {
    "X-API-TOKEN": token,
    "Content-Type": "application/json",
  };
  var body = JSON.stringify({
    format: "json",
    ...options,
    compress: false,
    limit: 600,
    filterId: "fe0ca491-e33f-405f-9416-481a135c6d46",
  });

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

//This is just for Results that have ip address and not Country/State

module.exports = {
  qualtricsData,
};
