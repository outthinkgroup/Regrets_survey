require("dotenv").config();
const {
  owner,
  repo,
  githubToken,
  qualtricsToken,
  ipStackKey,
  surveyId,
} = require("./functions/triggerRebuild/config");

const {
  qualtricsData,
} = require("./functions/triggerRebuild/qualtricsData.js");
const mainFileERR = [];

console.log({
  statusCode: 200,
  body: JSON.stringify(
    {
      msg: "https://github.com/outthinkgroup/Regrets_survey",
      results: results || "oh no, no results to show",
      err: mainFileERR,
    },
    null,
    2
  ),
});
