require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const { decode } = require("base-64");
var Base64 = require("js-base64").Base64;
const { qualtricsData } = require("./qualtricsData");

const errorMessages = []; //TODO Remove ERROR handling here

async function updateFileInGit({
  owner,
  repo,
  githubToken,
  qualtricsToken,
  surveyId,
  branch = "staging",
  exportOptions = {},
}) {
  const octokit = new Octokit({
    auth: githubToken,
  });

  const { sha, content } = await getFileBlobContents({ branch }).catch(
    (e) => e
  );

  const oldData = JSON.parse(content).results;
  if (oldData === "undefined") {
    console.log("received undefined");
    return "Error: received undefined from the previous file";
  }

  const { data, q_errors } = await qualtricsData({
    token: qualtricsToken,
    surveyId,
    oldData,
    exportOptions,
  }).catch((e) => {
    errorMessages.push(e);
  });

  const previousLocationCount = oldData.locationCount;
  const previousRegretCount = oldData.regretCount;
  data.results.previousRegretCount = previousRegretCount;
  data.results.previousLocationCount = previousLocationCount;
  const { locationCount, regretCount } = data.results;

  if (locationCount < previousLocationCount) {
    const errorMsg = `ERROR: Location Count is less than previously ( prev: ${previousLocationCount}, new: ${locationCount} )`;
    errorMessages.push({
      mainGitFN: errorMsg,
    });

    return errorMsg;
  }
  if (regretCount < previousRegretCount) {
    const errorMsg = `ERROR: Regret Count is less than previously ( prev: ${previousRegretCount}, new: ${regretCount} )`;
    errorMessages.push({
      mainGitFN: errorMsg,
    });
    return errorMsg;
  }

  const results = JSON.stringify(data, null, 2);
  if (results === "undefined") {
    return "ERROR: after qualtrics data function was run we got `undefined`";
  }

  const res = await updateFile({
    filepath: "data/data.json",
    sha,
    content: results,
    branch,
  })
    .then((res) => res)
    .catch((e) => {
      errorMessages.push({ updateFile: e });
    });
  return {
    updateFileResults: res,
    dataFromQualtrics: { data },
    errorMessages,
  };

  //!end of function
  ///?--//0--/

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
    if (content == "undefined")
      return "ERROR: in updatefile function (line 68) the content equals undefined";
    if (typeof content === "undefined")
      return "ERROR: in updatefile function (line 68) is of type undefined";
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filepath,
      branch: branch,
      message: `automatic update to ${filepath}`,
      content: Base64.encode(content),
      sha,
    });

    return response;
  }
  async function getFileBlobContents({ branch }) {
    //get the commit sha
    const { data: commitData } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: branch,
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

    return { content: Base64.decode(blob.data.content), sha: fileBlobSha };
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
