const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res, next) => {
    // if ((!req.body, campground))
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;

    await campground.save();
    req.flash("success", "Successfully Made a New Campground!");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id).populate({ path: "reviews", populate: { path: "author" } });

    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id);

    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });

    // const campground = await Campground.findByIdAndUpdate(id, {
    //   ...req.body.campground,
    // }, { new: true });

    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
