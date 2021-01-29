const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// DB Config
const keys = require("./config/keys");

// Connect to MongoDB
mongoose
  .connect(keys.MongodbLocalURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Public Folder
app.use(express.static("public"));

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on port ${port}`));
