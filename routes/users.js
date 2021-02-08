//jshint esversion:7
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");

// User model
const User = require("../models/User");

// Page
router.get("/login", (req, res) => res.render("login"));

// Register Page
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push("Please fill in all fields.");
  }

  // Check passwords match
  if (password !== password2) {
    errors.push("Passwords do not match.");
  }

  // Check valid email
  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  if (!emailIsValid(email)) {
    errors.push("Please enter a valid email.");
  }

  // Check password length
  if (password.length < 7) {
    errors.push("Password should be at least 8 characters.");
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // User Validation
    User.findOne({ email: email }, (err, foundUser) => {
      if (foundUser) {
        errors.push("That email is already registered.");
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // Hash Password
        bcrypt.hash(password, 12, (err, hash) => {
          const hashedPassword = hash;

          // Create User
          const newUser = new User({
            name,
            email,
            password: hashedPassword
          });

          // Save User
          newUser.save((err, savedUser) => {
            if (!err) {
              req.flash(
                "success_msg",
                "You are now registered and can log in."
              );
              res.redirect("/users/login");
            } else {
              console.log(err);
            }
          });
        });
      }
    });
  }
});

// Login Handle
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/dashboard",
//     failureRedirect: "/users/login",
//     failureFlash: true
//   })(req, res, next);
// });
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out.");
  res.redirect("/users/login");
});

module.exports = router;
