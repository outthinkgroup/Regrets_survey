const github = require("@actions/github");
const core = require("@actions/core");
const { updateFileInGit } = require("./github.js");
try {
  // `who-to-greet` input defined in action metadata file
  const repo = core.getInput("repo");
  const owner = core.getInput("owner");
  const time = new Date().toTimeString();
  core.setOutput("time", time);

  updateFileInGit({ owner, repo });

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
