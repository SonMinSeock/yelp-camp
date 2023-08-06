const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const {
        body: { username, email, password },
      } = req;

      const user = new User({
        username,
        email,
      });

      const registerUser = await User.register(user, password);

      console.log(registerUser);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

module.exports = router;
