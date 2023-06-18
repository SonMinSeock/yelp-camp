const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;
