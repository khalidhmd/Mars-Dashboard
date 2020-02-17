require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "../public")));

// your API calls

app.get("/favicon.ico", (req, res) => res.send("ok"));

app.get("/rover", async (req, res) => {
  try {
    let { photo_manifest } = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1//manifests/${req.query["rover"]}/?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    const {
      name,
      landing_date,
      launch_date,
      status,
      max_sol,
      max_date
    } = photo_manifest;
    const photos = await getPhotos(name, max_sol);
    res.send({
      name,
      landing_date,
      launch_date,
      status,
      max_sol,
      max_date,
      photos
    });
  } catch (err) {
    console.log("error:", err);
  }
});

const getPhotos = async (rover, sol) => {
  try {
    let { photos } = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    return photos.map(photo => photo.img_src);
  } catch (err) {
    console.log("error:", err);
  }
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
