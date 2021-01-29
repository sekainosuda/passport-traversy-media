//jshint esversion:7
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// User model
const User = require("../models/User");

// Login Page
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
    console.log("Please fill in all fields.");
  }

  // Check passwords match
  if (password !== password2) {
    errors.push("Passwords do not match.");
    console.log("Passwords do not match.");
  }

  // Check valid email
  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  if (!emailIsValid(email)) {
    errors.push("Please enter a valid email.");
    console.log("Please enter a valid email.");
  }

  // Check password length
  if (password.length < 7) {
    errors.push("Password should be at least 8 characters.");
    console.log("Password should be at least 8 characters.");
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
        errors.push("The email is already registered.");
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

module.exports = router;
