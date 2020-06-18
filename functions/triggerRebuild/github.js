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
  branch = "master",
}) {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const { sha, content } = await getFileBlobContents({}).catch((e) =>
    console.log("getting the file", e)
  );

  const oldData = JSON.parse(content).results;

  const data = await qualtricsData({
    token: qualtricsToken,
    ipStackKey,
    surveyId,
    oldData,
  });
  const results = JSON.stringify(data);

  const res = await updateFile({
    filepath: "data/data.json",
    sha,
    content: results,
  })
    .then((res) => res)
    .catch((e) => console.log("updating the file", { e }));
  //end of function

  async function getFile({ filepath }) {
    const response = await octokit.repos.getContents({
      owner,
      repo,
      ref: "staging",
      path: filepath,
    });
    const { data } = response;
    const { sha } = data;
    console.log(sha);
    const content = decode(data.content);
    return { sha, content };
  }

  async function updateFile({ filepath, sha, content, branch }) {
    const bytes = utf8.encode(content);
    const response = await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: filepath,
      branch: "staging",
      message: `automatic update to ${filepath}`,
      content: encode(bytes),
      sha,
    });

    return response;
  }
  async function getFileBlobContents() {
    //get the commit sha
    const { data: commitData } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: "staging",
    });

    //get tree sha
    const { sha } = commitData.commit.tree;
    const treeData = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: sha,
    });
    const dataDirSha = treeData.data.tree.find((obj) => obj.path === "data");
    const { data: dataDirTreeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: dataDirSha.sha,
    });
    const fileBlobSha = dataDirTreeData.tree.find(
      (obj) => obj.path === "data.json"
    ).sha;
    //console.log(fileBlobSha);
    const blob = await octokit.git.getBlob({
      owner,
      repo,
      file_sha: fileBlobSha,
    });

    return { content: decode(blob.data.content), sha: fileBlobSha };
  }
}
module.exports = { updateFileInGit };

// updateFileInGit({
//   owner: "outthinkgroup",
//   repo: "Regrets_survey",
//   githubToken: process.env.AUTH,
//   qualtricsToken: process.env.QUALTRICS_TOKEN,
//   ipStackKey: process.env.IP_STACK_KEY,
//   surveyId: process.env.SURVEY_ID,
// })
//   //.then((re) => console.log(JSON.stringify(re, null, 2)))
//   .catch((e) => console.log(e));
