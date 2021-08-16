/*THIS FILE IS A DEPENDENCY FOR A NETLIFY FUNCTION "SHAREIMAGE"*/
/*ITS HERE FOR HMR*/
const fetch = require("node-fetch");
require("dotenv").config();

const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? "https://worldregretsurvey.com"
    : "http://localhost:8888";

async function webScrape({ event }, chromium, isProd) {
  // BUILDING THE URL OF SITE TO SCREENSHOT

  console.log(process.env.NODE_ENV);
  const [, , , , id, gender, age, regret, ...location] = event.path.split("/");
  const regretInfoParams = { gender, age, regret, location: [...location] }; //location = [counrty, ?state]
  const regretInfoString = createUrlParameters(regretInfoParams);
  const url = `${BASE_URL}/shareimage?${regretInfoString}`;
  console.log(url);

  // this is the code that would normally check if image is in cache
  // If we already have it dont rebuild it
  // If image already exists redirect to image..
  //imageBlob = await checkRegretImageCache(id);
  //if (imageBlob) {
  //console.log(imageBlob);
  //console.log("should be here");
  //return {
  //statusCode: 200,
  //body: imageBlob.toString("base64"),
  //isBase64Encoded: true,
  //headers: {
  //"Content-Type": "image/png",
  //},
  //};
  //}

  var browser;

  try {
    const launchConfig = {
      headless: isProd ? chromium.headless : true,
      args: chromium.args,
    };
    if (isProd) {
      launchConfig.executablePath = await chromium.executablePath;
    }

    browser = await chromium.puppeteer.launch(launchConfig);

    var page = await browser.newPage();
    page.setViewport({
      width: isProd ? 1050 : 1024,
      height: 512,
      deviceScaleFactor: 2,
    });
    await page.goto(`${url}`);
    //hey
    // await page.waitForTimeout(isProd ? 100 : 100);
    await page.waitForTimeout("500");
    const screenshot = await page.screenshot();

    await browser.close();

    // update static/regret-images/ folder in get with screenshot..

    // use id to name the file

    return {
      statusCode: 200,
      body: screenshot.toString("base64"),
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    };
  } catch (err) {
    // Catch and display errors
    console.error(err);
    await browser.close();
    return {
      statusCode: 200,
      body: "noooooooo it didn't work",
    };
  }
}

const findUrlOption = (o) => o.key == "url";
const findWidthOption = (o) => o.key == "width" || o.key == "w";
const findHeightOption = (o) => o.key == "height" || o.key == "h";

// add all callback functions that look for reserved keys
const reservedCb = [findUrlOption, findWidthOption, findHeightOption];
function filterOutReserved(o) {
  for (cb of reservedCb) {
    if (cb(o)) {
      return false;
    }
  }
  return true;
}
async function checkRegretImageCache(name) {
  const image = await fetch(`${BASE_URL}/${name}.png`).catch(() => false);
  console.log(`${BASE_URL}/${name}.png`);
  if (image.headers.get("content-type") !== "image/png") return false;
  const imageBlob = await image.buffer();
  return imageBlob;
}
function createUrlParameters({
  age,
  regret,
  gender,
  location: [country, state],
}) {
  return `age=${age}&regret=${regret}&gender=${gender}&country=${country}${
    state ? `&state=${state}` : ``
  }`;
}

module.exports = { webScrape };
