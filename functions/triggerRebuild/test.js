require("dotenv").config();
const { qualtricsData } = require("./qualtricsData.js");
const oldData = {};
async function test() {
  const token = process.env.AUTH;
  const surveyId = process.env.SURVEY_ID;
  const ipStackKey = process.env.IP_STACK_KEY;

  const data = await qualtricsData({ token, surveyId, ipStackKey, oldData });
  console.log(data);
}
test();
