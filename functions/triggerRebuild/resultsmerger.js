const approvedStates = require("../../src/lib/approvedStates");
const { unSnakeCase } = require("../../src/lib/snakeCase");
const alterCountryList = require("../../src/lib/alterCountryList");
const alterStateList = require("../../src/lib/alterStateList");

//find location
//include in obj
//reduce length for each key
//return obj
const AMOUNT_PER_ENTRY = 10;

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
            age: values.QID3_TEXT,
          };
          responseDetails.location = await setLocation(response, config);
          resolve(responseDetails);
        })
    )
  );
}
async function mergeData({ newData, oldData = {}, config }) {
  const { regretList: oldRegretList } = oldData;

  const regretObj = oldRegretList ? createObjByLocation(oldRegretList) : {};
  const cleanedData = await getCleanedData(newData, config);

  const mergedDataOBJ = cleanedData.reduce((mergedRegrets, response) => {
    const locationKey = getLocationKey(response.location);

    if (!locationKey) return mergedRegrets;
    if (!mergedRegrets[locationKey]) {
      mergedRegrets[locationKey] = [];
    }
    //checking for dummy regrets
    const { regret } = response;
    if (regret.match(/asdf/)) return mergedRegrets;
    if (regret.match("test response")) return mergedRegrets;
    if (regret.match(/Ã/)) return mergedRegrets;
    if (regret.match(/â/)) return mergedRegrets;

    const responseExists = mergedRegrets[locationKey].find(
      (res) => res.id === response.id
    );
    //console.log(responseExists);
    if (responseExists) return mergedRegrets;
    const updatedResults = [...mergedRegrets[locationKey], response].sort(
      (a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        //newest to oldest
        return aDate <= bDate ? 1 : -1;
      }
    );

    if (updatedResults.length > AMOUNT_PER_ENTRY) {
      updatedResults.length = AMOUNT_PER_ENTRY;
    }
    mergedRegrets[locationKey] = updatedResults;

    return mergedRegrets;
  }, regretObj);
  //console.log(mergedData);

  const locationNames = Object.keys(mergedDataOBJ);
  const locations = locationNames.map((name) => {
    const regretCount = mergedDataOBJ[name].length;
    return { name, regretCount };
  });
  const regretList = locationNames.reduce((fullList, location) => {
    const regretsInLocation = mergedDataOBJ[location];
    return [...fullList, ...regretsInLocation];
  }, []);
  console.log(locations.length, regretList.length);
  return { locations, regretList };
}

function setLocation({ labels, values }, config) {
  const location = {};
  if (labels.QID4) {
    const { QID4: country, QID6: state } = labels;
    location.state = state;
    location.country = country;

    //need to normalize countries to match the map.
    if (listObjectsValues(alterCountryList).includes(country)) {
      const idOfLocation = Object.entries(alterCountryList).find(
        ([key, value]) => value === country
      )[0];
      location.country = unSnakeCase(idOfLocation);
    }
    if (listObjectsValues(alterStateList).includes(state)) {
      const idOfLocation = Object.entries(alterStateList).find(
        ([key, value]) => value === state
      )[0]; //returns the key and uses that as the location
      location.state = unSnakeCase(idOfLocation);
    }

    return location;
  } else {
    return null;
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
  if (location && location.state && approvedStates.includes(location.state)) {
    return snakeCase(location.state);
  } else if (location && location.country) {
    return snakeCase(location.country);
  } else {
    return null;
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
