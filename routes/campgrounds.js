const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schema");

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
  validateCampground,
  wrapAsync(async (req, res, next) => {
    // if ((!req.body, campground))
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);

    await campground.save();
    req.flash("success", "Successfully Made a New Campground!");

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id).populate("reviews");

    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const {
      params: { id },
    } = req;

    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
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

    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
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
