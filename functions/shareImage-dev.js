const puppeteer = require("puppeteer");
const { webScrape } = require("../webscrape.js");
const chromium = require("chrome-aws-lambda");

exports.handler = (event, context) =>
  webScrape({ event, context }, chromium, false);
