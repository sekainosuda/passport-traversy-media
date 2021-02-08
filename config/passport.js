const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Load User Model
const User = require("../models/User");

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email }, (err, foundUser) => {
        if (err) {
          return done(err);
        }
        if (!foundUser) {
          return done(null, false, {
            message: "That email is not registered."
          });
        }

        // Match Password
        bcrypt.compare(password, foundUser.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            return done(null, false, { message: "Password is incorrect." });
          }
          console.log(foundUser);
          return done(null, foundUser);
        });
      });
    })
  );

  // Serialize/Desrialize User
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
