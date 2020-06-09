const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
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
  return triggerDeploy("outthinkgroup", "Regrets_survey")
    .then((res) => ({
      statusCode: 200,
      body: JSON.stringify({
        message: "successfully started the rebuilding of the regrets data",
      }),
    }))
    .catch((e) => console.log(e));
};
