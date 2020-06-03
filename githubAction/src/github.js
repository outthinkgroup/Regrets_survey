require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const { decode, encode } = require("base-64");
const utf8 = require("utf8");
const { qualtricsData } = require("./qualtricsData");

async function updateFileInGit({
  owner,
  repo,
  githubToken,
  qualtricsToken,
  ipStackKey,
  surveyId,
}) {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const { sha } = await getFile({
    filepath: "data/results.json",
  }).catch((e) => console.log(e));

  const data = await qualtricsData({
    token: qualtricsToken,
    ipStackKey,
    surveyId,
  });
  const json = JSON.stringify(data);

  const res = await updateFile({
    filepath: "data/results.json",
    sha,
    content: json,
  }).catch((e) => console.log({ e, json }));

  async function getFile({ filepath }) {
    const response = await octokit.repos.getContents({
      owner,
      repo,
      path: filepath,
    });
    const { data } = response;
    const { sha } = data;
    const content = decode(data.content);
    return { sha, content };
  }

  async function updateFile({ filepath, sha, content }) {
    const bytes = utf8.encode(content);
    const response = await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: filepath,
      message: `automatic update to ${filepath}`,
      content: encode(bytes),
      sha,
    });

    return response;
  }
}
module.exports = { updateFileInGit };

const octokit = new Octokit({
  auth: process.env.AUTH,
});
async function triggerDeploy(owner, repo) {
  const response = await octokit.repos.createDispatchEvent({
    owner,
    repo,
    event_type: "deployment",
  });
  console.log(response);
}
triggerDeploy("outthinkgroup", "Regrets_survey").catch((e) => console.log(e));
