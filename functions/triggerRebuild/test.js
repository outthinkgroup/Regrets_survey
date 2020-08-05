require("dotenv").config();
const { qualtricsData } = require("./qualtricsData.js");
const oldData = {};
async function test() {
  const token = "UkQ5ToTwLaQ2ZzbfQXRQJ47ucgdyJrAuQmawdouV";
  const surveyId = "SV_3CRcRbjb7pIenxr";
  const ipStackKey = process.env.IP_STACK_KEY;

  const data = await qualtricsData({ token, surveyId, ipStackKey, oldData });
  console.log(data);
}
test();
