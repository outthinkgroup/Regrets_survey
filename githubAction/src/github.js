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

  const oldData = JSON.parse(JSON.parse(content).results);
  console.log(Object.keys(oldData));
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
    branch,
  }).catch((e) => console.log("updating the file", { e, json }));
  //end of function

  async function getFile({ filepath }) {
    /* const response = await octokit.repos.getContent({
      owner,
      repo,
      path: filepath,
    }); */
    //get the commit sha
    const commit = octokit.repos.getCommit({
      owner,
      repo,
      ref: "master",
    });
    //get tree sha
    // get subtree or blob sha

    const { data } = response;
    const { sha } = data;
    const content = decode(data.content);
    const blob = await octokit.git.getBlob({
      owner,
      repo,
      sha,
    });
    return { sha, blob, content };
  }

  async function updateFile({ filepath, sha, content, branch }) {
    const bytes = utf8.encode(content);
    const response = await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: filepath,
      message: `automatic update to ${filepath}`,
      content: encode(bytes),
      ref: branch,
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
//triggerDeploy("outthinkgroup", "Regrets_survey").catch((e) => console.log(e));
async function getFileBlobContents({ filepath }) {
  //get the commit sha
  const { data: commitData } = await octokit.repos.getCommit({
    owner: "outthinkgroup",
    repo: "Regrets_survey",
    ref: "master",
  });

  //get tree sha
  const { sha } = commitData.commit.tree;
  const treeData = await octokit.git.getTree({
    owner: "outthinkgroup",
    repo: "Regrets_survey",
    tree_sha: sha,
  });
  const dataDirSha = treeData.data.tree.find((obj) => obj.path === "data");
  const { data: dataDirTreeData } = await octokit.git.getTree({
    owner: "outthinkgroup",
    repo: "Regrets_survey",
    tree_sha: dataDirSha.sha,
  });
  const fileBlobSha = dataDirTreeData.tree.find(
    (obj) => obj.path === "data.json"
  ).sha;
  //console.log(fileBlobSha);
  const blob = await octokit.git.getBlob({
    owner: "outthinkgroup",
    repo: "Regrets_survey",
    file_sha: fileBlobSha,
  });

  return { content: decode(blob.data.content), sha: fileBlobSha };
}
updateFileInGit({
  owner: "outthinkgroup",
  repo: "Regrets_survey",
  githubToken: process.env.AUTH,
  qualtricsToken: process.env.QUALTRICS_TOKEN,
  ipStackKey: process.env.IP_STACK_KEY,
  surveyId: process.env.SURVEY_ID,
})
  //.then((re) => console.log(JSON.stringify(re, null, 2)))
  .catch((e) => console.log(e));
