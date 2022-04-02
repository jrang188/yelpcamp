const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

/**
 * Mongoose connection to MongoDB
 */
async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelpcamp");
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

//root route
app.get("/", (req, res) => {
  res.render("home");
});

// INDEX route - show all campgrounds
app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
}));

// NEW route - show form to create new campground
app.get("/campgrounds/new", catchAsync(async (req, res) => {
  res.render("campgrounds/new");
}));

// CREATE route - add new campground to DB
app.post("/campgrounds", catchAsync(async(req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground.id}`);
}));

// SHOW route - show info about one campground
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
}));

// EDIT route - show form to edit campground
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

// UPDATE route - update campground in DB
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground.id}`);
}));

// DELETE route - delete campground from DB
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

app.use((err, req, res, next) => {
  res.send("OH NO!!");
});

// Port Setup
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
