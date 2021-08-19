const fetch = require("node-fetch");
require("dotenv").config();
exports.handler = async (event) => {
  const { queryStringParameters } = event;
  const { id, regret, age, gender, country, state } = queryStringParameters;
  const isDev = process.env.NODE_ENV === "development";
  const url = isDev ? `http://localhost:8888` : `https://worldregretsurvey.com`;
  const imageFn = isDev ? "shareImage-dev" : "shareImage";
  console.log(process.env.NODE_ENV);
  console.log({ id, regret, age });

  const shareTemplate = `
  <!-- Twitter Card data -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="worldregretsurvey.com">
<meta name="twitter:title" content="${gender}, ${age} ">
<meta name="twitter:description" content="A regret from the World Regret Survey" >
<meta name="twitter:creator" content="@danpink">
<-- Twitter Summary card images must be at least 120x120px -->
<meta name="twitter:image"  content="${url}/api/${imageFn}/${id}/${gender}/${age}/${encodeURIComponent(
    regret
  )}/${country}/${state ? state : ""}" >

<!-- Open Graph data -->
<meta property="og:title" content="${gender}, ${age}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}/share-regret/?id=${id}&regret=${regret}&age=${age}&gender=${gender}&country=${country}${
    state ? `&state=${state}` : ""
  }" />
<meta property="og:image" content="${url}/api/${imageFn}/${id}/${gender}/${age}/${encodeURIComponent(
    regret
  )}/${country}/${state ? state : ""}"  />
<meta property="og:description" content="A regret from the World Regret Survey" />
<meta property="og:site_name" content="World Regret Survey" />
  `;
  const oldHtml = await fetch(
    `${url}/share-regret/?id=${id}&regret=${regret}&age=${age}&gender=${gender}&country=${country}${
      state ? `&state=${state}` : ""
    }`
  ).then((res) => res.text());
  const newHtml = oldHtml.replace("<head>", `<head>${shareTemplate}`);
  console.log("21");
  return {
    statusCode: 200,
    body: newHtml,
  };
};
