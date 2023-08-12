const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post("/", isLoggedIn, validateReview, async (req, res) => {
  const {
    params: { id },
  } = req;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();

  req.flash("success", "Successfully Created new Review");
  res.redirect(`/campgrounds/${campground._id}`);
});

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted Review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
