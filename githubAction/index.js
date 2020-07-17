const fetch = require("node-fetch");

async function triggerBuild() {
  const res = await fetch(
    "https://worldregretsurvey.com//.netlify/functions/triggerRebuild",
    {
      method: "POST",
      body: JSON.stringify({ branch: "master" }),
    }
  ).then((res) => res.json());
  console.log(res);
}
triggerBuild();
