//const cloudinary = require("cloudinary").v2;
//      ^^^^^^^^^^ -> possibly too large.
// Use the REST API.  To Sign include auth in post request {key:secret}
const upload = require("./cu.js");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
dotenv.config();

const cloudinaryURL = `https://res.cloudinary.com/outthink/image/upload/c_scale,q_auto,w_832/regret-images`;
const cloudinaryUploadURL = `https://res.cloudinary.com/outthink/image/upload`;
//cloudinary.config({
//cloud_name: process.env.CLOUDINARY_NAME,
//api_key: process.env.CLOUDINARY_API_KEY,
//api_secret: process.env.CLOUDINARY_API_SECRET,
//});
// options {
// folder:string,(regret-images/<regretId>)
// }
// When doing a signed upload, you'll use a function like this:
async function uploadToCloudinary(file, id, options = {}) {
  //console.log(id);
  //const public_id = `regret-images/${id}`;
  //const res = await cloudinary.uploader.upload(
  //file.replace(/(\r\n|\n|\r)/gm, ""),
  //{ public_id, ...options }
  //);
  ////const url = `https://api.cloudinary.com/v1_1/outthink/images/upload`;
  ////const res = await fetch(url, {
  ////method: "POST",
  ////body: JSON.stringify({ file, public_id }),
  ////}).then((res) => res.json());
  //console.log(res);
  //return res;
}

async function cloudinaryRestUploader(file, id, options = {}) {
  const public_id = `regret-images/${id}`;

  console.log("hey");
  const res = await upload(file, { public_id });
  console.log("from upload", res);
  return res;
}

module.exports = {
  cloudinaryRestUploader,
  uploadToCloudinary,
  cloudinaryURL,
  cloudinaryUploadURL,
};
