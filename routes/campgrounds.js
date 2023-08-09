const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schema");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);

  const { error } = result;

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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

    const campground = await Campground.findById(id).populate("reviews").populate("author");
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
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id);

    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }

    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/campgrounds/${id}`);
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

    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/campgrounds/${id}`);
    }
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
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/campgrounds/${id}`);
    }

    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
