const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews")

/**
 * Mongoose connection to MongoDB
 */
async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelpcamp");
  console.log("Mongodb online!!!")
}

// Error Logging for Mongoose
main().catch((err) => console.log(err));

// Create express app
const app = express();

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // config express to use ejs-mate as a custom template engine

app.use(express.urlencoded({ extended: true })); // initialize middleware that parses urlencoded bodies
app.use(methodOverride("_method")); // initialize method override to allow us to use the _method parameter in our form
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: 'placeholder-secret-for-now-hehe!!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

//root route
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "OH NO !! Something went wrong!";
  res.status(statusCode).render("error", { err });
});

// Port Setup
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
