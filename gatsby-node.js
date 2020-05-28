const fs = require("fs");

exports.onPreInit = () => {
  fs.writeFileSync("josh.txt", "hello world");
};
