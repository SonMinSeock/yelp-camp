const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");

// mongoose and mongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => console.log("Mongo Connection Open!!"))
  .catch((err) => console.log("Mongo connecting Error : ", err));

const PORT = 3000;
const app = express();

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds });
  })
);

app.post(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);

    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });

    // const campground = await Campground.findByIdAndUpdate(id, {
    //   ...req.body.campground,
    // }, { new: true });

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    await Campground.findByIdAndDelete(id);

    res.redirect("/campgrounds");
  })
);

app.use((err, req, res, next) => {
  res.send("Oh boy, Something went Worng!");
});

app.listen(PORT, () => console.log(`Server Listening on PORT : ${PORT}`));
