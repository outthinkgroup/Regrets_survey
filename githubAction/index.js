const fetch = require("node-fetch");

async function triggerBuild() {
  const res = await fetch(
    "https://worldregretsurvey.com/.netlify/functions/triggerRebuild",
    {
      method: "POST",
      body: JSON.stringify({ branch: "master" }),
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res;
    });
  return res;
}
triggerBuild();
