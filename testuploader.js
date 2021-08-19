const { webScrape } = require("./functions/webscrape.js");
const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");

(async function TEST() {
  const id = "123";
  const gender = "male";
  const regret = "I told you so.";
  const country = "united state of america";
  const state = "yourmom";

  const event = {
    path: `_/_/_/_/${id}/${gender}/${encodeURIComponent(
      regret
    )}/${country}/${state}`,
  };
  const res = await webScrape({ event, context: {} }, chromium, false);
  console.log(res);
  return;
})();