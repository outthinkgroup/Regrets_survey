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

exports.handler = async function(event, context) {
  const results = await updateFileInGit({
    owner,
    repo,
    githubToken,
    qualtricsToken,
    ipStackKey,
    surveyId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "https://github.com/outthinkgroup/Regrets_survey",
    }),
  };
};
