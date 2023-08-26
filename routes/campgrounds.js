const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(wrapAsync(campgrounds.index))
  // .post(isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));
  .post(upload.array("image"), (req, res) => {
    console.log(req.body, req.files);
  });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCampground))
  .put(isLoggedIn, validateCampground, wrapAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;
