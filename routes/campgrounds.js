const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router.get("/", wrapAsync(campgrounds.index));

router.post("/", isLoggedIn, validateCampground, wrapAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.get("/:id", wrapAsync(campgrounds.showCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

router.put("/:id", isLoggedIn, validateCampground, wrapAsync(campgrounds.updateCampground));

router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

module.exports = router;
