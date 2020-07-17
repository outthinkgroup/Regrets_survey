const { Octokit } = require("@octokit/rest");
const {
  owner,
  repo,
  githubToken,
  qualtricsToken,
  ipStackKey,
  surveyId,
} = require("./config");
const { updateFileInGit } = require("./github.js");
const mainFileERR = [];
exports.handler = async function(event, context) {
  const { branch } = JSON.parse(event.body);
  const results = await updateFileInGit({
    owner,
    repo,
    githubToken,
    qualtricsToken,
    ipStackKey,
    surveyId,
    branch,
  }).catch((e) => mainFileERR.push(e));
  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "https://github.com/outthinkgroup/Regrets_survey",
      results: results || "oh no, no results to show",
      err: mainFileERR,
    }),
  };
};
