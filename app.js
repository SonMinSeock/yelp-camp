const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

// mongoose and mongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => console.log("Mongo Connection Open!!"))
  .catch((err) => console.log("Mongo connecting Error : ", err));

const PORT = 3000;
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "cheep camping!",
  });

  await camp.save();

  res.send(camp);
});

app.listen(PORT, () => console.log(`Server Listening on PORT : ${PORT}`));
