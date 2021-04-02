const fs = require("fs");
/**
 * Gets the date of last week in ISO format
 *
 * @returns {string}  ISO string of last week
 */
function getLastWeekISO() {
  const today = new Date().getTime(); //Unix Epoch
  //get how long miliseconds a week is
  const oneWeekMilliseconds = 1000 * 60 * 60 * 24 * 7; //604800000
  //subtract that from today
  const lastWeekUnixEpoch = today - oneWeekMilliseconds;
  //get iso
  const iso = new Date(lastWeekUnixEpoch).toISOString();
  return iso;
}

function asyncWriteFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, { encoding: "utf8" }, (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
}

module.exports = { getLastWeekISO, asyncWriteFile };

//TEST
