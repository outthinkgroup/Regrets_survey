const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// options {
// folder:string,(regret-images/<regretId>)
// }
// When doing a signed upload, you'll use a function like this:
async function uploadToCloudinary(file, id, options = {}) {
  console.log(id);
  const public_id = `regret-images/${id}`;
  const res = await cloudinary.uploader.upload(
    file.replace(/(\r\n|\n|\r)/gm, ""),
    { public_id, ...options }
  );
  //const url = `https://api.cloudinary.com/v1_1/outthink/images/upload`;
  //const res = await fetch(url, {
  //method: "POST",
  //body: JSON.stringify({ file, public_id }),
  //}).then((res) => res.json());
  console.log(res);
  return res;
}
const cloudinaryURL = `https://res.cloudinary.com/outthink/image/upload/regret-images`;
module.exports = { uploadToCloudinary, cloudinaryURL };
