const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

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

      req.login(registerUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", async (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
  async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
  }
);

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "GoodBye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
