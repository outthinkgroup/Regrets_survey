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

  const oldHtml = await fetch(
    `${url}/share-regret/?id=${id}&regret=${regret}&age=${age}&gender=${gender}&country=${country}${
      state ? `&state=${state}` : ""
    }`
  ).then((res) => res.text());
  const newHtml = oldHtml.replace(
    "<head>",
    `<head>
    <meta name="og:image" content="${url}/api/${imageFn}/${id}/${gender}/${age}/${encodeURIComponent(
      regret
    )}/${country}/${state ? state : ""}" />`
  );
  console.log("21");
  return {
    statusCode: 200,
    body: newHtml,
  };
};
