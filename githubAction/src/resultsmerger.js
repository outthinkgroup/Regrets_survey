const oldData = require("../../data/data.json");
const newRawData = require("../../rawData/rawData.json");
const fetch = require("node-fetch");
const approvedStates = require("../../src/lib/approvedStates");
const IP_STACK_KEY = process.env.IP_STACK_KEY;
const config = { ipStackKey: IP_STACK_KEY };

//find location
//include in obj
//reduce length for each key
//return obj

async function getCleanedData(data, config) {
  return Promise.all(
    data.responses.map(
      async (response) =>
        new Promise(async (resolve, reject) => {
          const { values, labels, responseId } = response;
          const responseDetails = {
            regret: values.QID1_TEXT || "",
            gender: labels.QID2 || "",
            id: responseId,
            date: values.endDate,
          };
          responseDetails.location = await setLocation(response, config);
          resolve(responseDetails);
        })
    )
  );
}
async function mergeData({ newData, oldData = {}, config }) {
  const cleanedData = await getCleanedData(newData, config);

  const mergedData = cleanedData.reduce((oldDataObj, response) => {
    const locationKey = getLocationKey(response.location);

    if (!locationKey) return oldDataObj;
    if (!oldDataObj[locationKey]) {
      oldDataObj[locationKey] = [];
    }
    const responseExists = oldDataObj[locationKey].find(
      (res) => res.id === response.id
    );
    //console.log(responseExists);
    if (responseExists) return oldDataObj;
    const updatedResults = [...oldDataObj[locationKey], response].sort(
      (a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate <= bDate ? 1 : -1;
      }
    );

    if (updatedResults.length > 5) {
      updatedResults.length = 5;
    }
    oldDataObj[locationKey] = updatedResults;

    return oldDataObj;
  }, oldData);
  //console.log(mergedData);
  return mergedData;
}

async function test() {
  const data = await mergeData(newRawData, oldData, config);

  console.log(JSON.stringify(data, null, 2));
}
//test();

function setLocation({ labels, values }, config) {
  const { ipAddress } = values;
  if (labels.QID4) {
    const { QID4: country, QID5: state } = labels;
    return { country, state };
  } else {
    return getLocationFromIP(ipAddress, config).then((res) => {
      const { country, state } = res;
      const location = { country, state };
      return location;
    });
  }
}

function createObjByLocation(array) {
  return array.reduce((obj, response) => {
    const locationKey = getLocationKey(response.location);
    if (!locationKey) return obj;
    if (!obj[locationKey]) {
      obj[locationKey] = [];
    }
    obj[locationKey] = [...obj[locationKey], response];
    return obj;
  }, {});
}
/* const data = createObjByLocation(oldData);
saveToFileSystem(data); */

function getLocationKey(location) {
  if (location.state && approvedStates.includes(location.state)) {
    return snakeCase(location.state);
  } else {
    return snakeCase(location.country);
  }
}

function snakeCase(string) {
  return string
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .map((x) => {
      const firstLetter = x[0].toUpperCase();
      const letterArray = x.split("");
      letterArray.splice(0, 1, firstLetter);
      const word = letterArray.join("");

      return word;
    })
    .join("_");
}

module.exports = { mergeData };

async function getLocationFromIP(ipAddress, config) {
  const res = await fetch(
    `http://api.ipstack.com/${ipAddress}?access_key=${config.ipStackKey}&format=1`
  );
  const data = await res.json();
  //console.log(data);
  const { country_name: country, region_name: state } = data;

  return { country, state };
}
