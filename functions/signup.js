require("dotenv").config();
const crypto = require("crypto");
const fetch = require("node-fetch");
const md5 = require("md5");
const LIST_ID = "4d8277f97a";
const API_KEY = process.env.MAILCHIMP_API_KEY;
const URL_BASE = "https://us2.api.mailchimp.com/3.0";
const GROUP_ID = "7cbbee50ad";
const headers = {
  Authorization: `apikey ${API_KEY}`,
};

exports.handler = async (event, context) => {
  const { email } = JSON.parse(event.body);
  const response = await updateListWithUser(email).catch((e) => {
    console.log(e);
    return e;
  });

  // return message
  //
  return {
    statusCode: 200,
    body: JSON.stringify({ message: response }),
  };
};
async function updateListWithUser(email) {
  const info = getInfo(email);
  const fetchOptions = getFetchOptions(info, "PUT");
  console.log(fetchOptions);
  const emailHash = md5(email.toLowerCase());
  const URL = `${URL_BASE}/lists/${LIST_ID}/members/${emailHash}`;
  const res = await fetch(URL, fetchOptions);
  const data = await res.json();
  if (data.status === "subscribed") {
    console.log(data.status);
    return data.status;
  } else {
    return data.title;
  }
}

function getInfo(email) {
  return {
    email_address: email,
    status: "subscribed",
    interests: { [GROUP_ID]: true },
  };
}
function getFetchOptions(info, method = "GET") {
  return {
    method,
    headers,
    body: JSON.stringify(info),
  };
}
function getHash(str) {
  return crypto.createHash("md5").update(str);
}
