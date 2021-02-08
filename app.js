const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const app = express();

// Passport config
require("./config/passport")(passport); // function(passport) is executed here

// DB Config
const keys = require("./config/keys");

// Connect to MongoDB
mongoose.connect(
  keys.MongodbLocalURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (!err) {
      console.log("MongoDB connected...");
    } else {
      console.log(err);
    }
  }
);

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: keys.sessionSecret,
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  next();
});

// Public Folder
app.use(express.static("public"));

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on port ${port}`));
