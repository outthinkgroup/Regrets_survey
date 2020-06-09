const fs = require("fs");
const data = require("./data/data.json");
//const file = fs.readFileSync("data/data.json", "utf8");
//const data = JSON.parse(file);
console.log(JSON.stringify(data, null, 2));
