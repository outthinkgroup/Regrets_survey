const puppeteer = require("puppeteer");
const { webScrape } = require("./shareImage/webscrape");
const chromium = require("chrome-aws-lambda");

exports.handler = (event, context) =>
  webScrape({ event, context }, chromium, false);
