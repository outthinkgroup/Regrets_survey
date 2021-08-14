const fetch = require("node-fetch");

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://worldregretsurvey.com"
    : "http://localhost:8888";
async function webScrape({ event }, chromium, isProd) {
  // BUILDING THE URL OF SITE TO SCREENSHOT
  const [, , , name, age, regret, ...location] = event.path.split("/");
  const regretInfo = { name, age, regret, location: [...location] }; //location = [counrty, ?state]
  const url = `${BASE_URL}/shareImage?info=${regretInfo}`;

  imageBlob = await checkRegretImageCache(name);
  if (imageBlob) {
    console.log("should be here");
    return {
      statusCode: 200,
      body: imageBlob.toString("base64"),
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    };
  }
  var browser;
  const width = null;
  const height = null;

  // If we already have it dont rebuild it
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
      width: width ? parseInt(width.value) : 1200,
      height: height ? parseInt(height.value) : 800,
      deviceScaleFactor: 2,
    });
    await page.goto(`${url}`);
    // await page.waitForTimeout(isProd ? 100 : 100);
    await page.waitForSelector("body");
    const screenshot = await page.screenshot();

    await browser.close();

    // update static/regret-images/ folder in get with screenshot..
    // update the /_redirects-file

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
  const imageBlob = await image.buffer();
  return imageBlob;
}

module.exports = { webScrape };
