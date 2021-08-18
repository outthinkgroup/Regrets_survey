const fetch = require("node-fetch");

exports.handler = async () => {
  const oldHtml = await fetch(
    "http://localhost:8888/regret-share"
  ).then((res) => res.text());
  const newHtml = oldHtml.replace(
    "<head>",
    `<head>
    <meta name="og:image" content="http://localhost:8888/worldmap.png" />`
  );

  return {
    statusCode: 200,
    body: newHtml,
  };
};
