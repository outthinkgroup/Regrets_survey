require("dotenv").config();
const { qualtricsData } = require("./qualtricsData.js");
const oldData = require("../../data/data.json");
const { asyncWriteFile } = require("./helpers");

/**
 * This is intended to be used after something has gone wrong and u need to restart all the data
 */
async function RebuildFromAugust() {
  const token = process.env.QUALTRICS_TOKEN;
  const surveyId = process.env.SURVEY_ID;
  const exportOptions = {
    limit: undefined,
    startDate: "2020-08-01T00:00:00.000Z",
  };
  const { data } = await qualtricsData({
    token,
    surveyId,
    oldData,
    exportOptions,
  });

  const previousLocationCount = oldData.locationCount;
  const previousRegretCount = oldData.regretCount;
  data.results.previousRegretCount = previousRegretCount ?? 0;
  data.results.previousLocationCount = previousLocationCount ?? 0;

  const path = await asyncWriteFile(
    "../../data/rebuilt-data.json",
    JSON.stringify(data, null, 2)
  );
  console.log(`done ${path}`);
}
RebuildFromAugust();
