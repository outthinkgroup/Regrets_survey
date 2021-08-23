/*THIS FILE IS A DEPENDENCY FOR A NETLIFY FUNCTION "SHAREIMAGE"*/
/*ITS HERE FOR HMR*/
const fetch = require("node-fetch");
require("dotenv").config();
const { uploadToCloudinary, cloudinaryURL } = require("./cloudinary");

const BASE_URL =
  process.env.NODE_ENV !== "development"
    ? "https://worldregretsurvey.com"
    : "http://localhost:8888";

async function webScrape({ event }, chromium, isProd) {
  // BUILDING THE URL OF SITE TO SCREENSHOT

  //console.log(process.env.NODE_ENV);
  const [, , , id, gender, age, regret, ...location] = event.path.split("/"); // THIS IS UGILY
  const regretInfoParams = { gender, age, regret, location: [...location] }; //location = [counrty, ?state]
  const regretInfoString = createUrlParameters(regretInfoParams);
  const url = `${BASE_URL}/shareimage?${regretInfoString}`;
  console.log(url);

  //CHECK IF WE ALREADY GOT IT
  const imageFromCloudinary = await fetch(`${cloudinaryURL}/${id}`);
  console.log(`${cloudinaryURL}/${id}`, imageFromCloudinary.ok);
  if (imageFromCloudinary.ok) {
    const image = await imageFromCloudinary.buffer();
    return {
      statusCode: 200,
      body: image.toString("base64"),
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    };
  }

  var browser;

  try {
    const launchConfig = {
      headless: isProd ? chromium.headless : true,
      args: chromium.args,
    };
    if (isProd) {
      launchConfig.executablePath = await chromium.executablePath;
    }

    console.log("before");
    browser = await chromium.puppeteer.launch(launchConfig);
    var page = await browser.newPage();
    page.setViewport({
      width: isProd ? 1024 + 20 : 1024,
      height: 512,
      deviceScaleFactor: 1.1,
    });
    console.log(url);
    await page.goto(`${url}`);
    //hey
    // await page.waitForTimeout(isProd ? 100 : 100);
    await page.waitForTimeout(500);
    console.log(71);
    const screenshot = await page.screenshot({ encoding: "base64" });

    await browser.close();
    console.log("here");

    // use id to name the file
    const res = await uploadToCloudinary(
      `data:image/png;base64,${screenshot}`,
      id
    );

    return {
      statusCode: 200,
      //body: screenshot.toString("base64"),
      body: screenshot,
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
function createUrlParameters({ age, gender, id, regret, location }) {
  return `age=${age}&gender=${gender}&id=${id}&regret=${encodeURIComponent(
    regret
  )}&country=${location[0]}${location[0] ? `&state=${location[1]}` : ""}`;
}

module.exports = { webScrape };
