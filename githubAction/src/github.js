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

  const { sha, content } = await getFile({
    filepath: "data/data.json",
  }).catch((e) => console.log(e));

  const oldData = JSON.parse(content);
  const data = await qualtricsData({
    token: qualtricsToken,
    ipStackKey,
    surveyId,
    oldData,
  });
  const json = JSON.stringify(data);
  const results = JSON.stringify({ results: json });
  const res = await updateFile({
    filepath: "data/data.json",
    sha,
    content: results,
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
