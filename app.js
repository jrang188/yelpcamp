if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategry = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

/**
 * Mongoose connection to MongoDB
 */
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelpcamp');
  console.log('Mongodb online!!!');
}

// Error Logging for Mongoose
main().catch((err) => console.log(err));

// Create express app
const app = express();

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate); // config express to use ejs-mate as a custom template engine

app.use(express.urlencoded({ extended: true })); // initialize middleware that parses urlencoded bodies
app.use(methodOverride('_method')); // initialize method override to allow us to use the _method parameter in our form
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize()); // initialize mongo sanitize to prevent mongodb injection

const sessionConfig = {
  name: 'session',
  secret: 'placeholder-secret-for-now-hehe!!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://res.cloudinary.com/di7euib4q/"
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://res.cloudinary.com/di7euib4q/"
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/di7euib4q/"
];
const fontSrcUrls = ["https://res.cloudinary.com/di7euib4q/"];
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          "https://res.cloudinary.com/di7euib4q/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
          "https://images.unsplash.com/",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
      },
    },
    crossOriginEmbedderPolicy: false
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategry(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/fakeUser', async (req, res) => {
  const user = new User({ email: 'qa@hocusfocus.com', username: 'hocusfocus' });
  const newUser = await User.register(user, 'bruh');
  res.send(newUser);
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//root route
app.get('/', (req, res) => {
  res.render('home');
});

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'OH NO !! Something went wrong!';
  res.status(statusCode).render('error', { err });
});

// Port Setup
app.listen(3000, () => {
  console.log('Serving on port 3000');
});
