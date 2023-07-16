const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");
const campgrounds = require("./routes/campgrounds");

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

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);

  const { error } = result;

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use("/campgrounds", campgrounds);

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/campgrounds/:id/reviews", validateReview, async (req, res) => {
  const {
    params: { id },
  } = req;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);

  campground.reviews.push(review);
  await review.save();
  await campground.save();

  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;

  if (!err.message) err.message = "On No, Something went Worng!";
  res.status(statusCode).render("error", { err });
});

app.listen(PORT, () => console.log(`Server Listening on PORT : ${PORT}`));
