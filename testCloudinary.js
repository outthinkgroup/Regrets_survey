const upload = require("./functions/shareImage/cu");
(async function cuTest() {
  upload(
    "https://warpspeedmortgage.com/wp-content/uploads/2021/04/house-moneybag.svg",
    { public_id: "test/test1" }
  );
})();
