require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const { decode, encode } = require("base-64");

const { qualtricsData } = require("./qualtricsData");

const OWNER = "joshatoutthink";
const REPO = "testing-node-github-actions";

const octokit = new Octokit({
  auth: process.env.AUTH,
});

async function updateFileInGit({ owner, repo }) {
  const { sha } = await getFile({
    owner,
    repo,
    filepath: "data/results.json",
  }).catch((e) => console.log(e));

  const data = await qualtricsData();
  const json = JSON.stringify(data);

  const res = await updateFile({
    owner,
    repo,
    filepath: "data/results.json",
    sha,
    content: json,
  }).catch((e) => console.log(e));
}

async function getFile({ owner, repo, filepath }) {
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

async function updateFile({ owner, repo, filepath, sha, content }) {
  const response = await octokit.repos.createOrUpdateFile({
    owner: OWNER,
    repo: REPO,
    path: filepath,
    message: `automatic update to ${filepath}`,
    content: encode(content),
    sha,
  });

  return response;
}
module.exports = { updateFileInGit };

async function triggerDeploy(owner, repo) {
  const response = await octokit.repos.createDispatchEvent({
    owner: OWNER,
    repo: REPO,
    event_type: "deployment",
  });
  console.log(response);
}
