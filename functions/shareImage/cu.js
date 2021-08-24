require("dotenv").config();
const sha1 = require("sha1");
const FormData = require("form-data");
const fetch = require("node-fetch");

const URL = `http://api.cloudinary.com/v1_1/outthink/image/upload`;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;

module.exports = async function upload(file, options) {
  const timestamp = Date.now();
  const { public_id } = options;
  const preSignedString = parameterize({ public_id, timestamp }) + secret;
  const signature = sha1(preSignedString);
  const fields = {
    api_key: key,
    file,
    public_id,
    timestamp,
    signature,
  };
  const form = new FormData();
  Object.keys(fields).forEach((key) => {
    form.append(key, fields[key]);
  });

  const res = await fetch(URL, {
    method: "POST",
    //headers: {
    //"Content-Type": "application/x-www-form-urlencoded",
    //},
    body: form,
  }).then((res) => res.text());
  return res;
};

function parameterize(fields) {
  const paramString = Object.keys(fields).reduce((paramString, key) => {
    return `${paramString}${key}=${fields[key]}&`;
  }, "");
  return paramString.substr(0, paramString.length - 1); // trim that last & from end of string
}
