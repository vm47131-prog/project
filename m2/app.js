const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = "mongodb://127.0.0.1:27017/foodDelivery";
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const Food = require("./models/food.js");
const cors = require("cors");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
//Home
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());
//implimenting passport   using local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // It contains the pre-written background logic that looks up the user in the database, extracts their encrypted password hash/salt, and verifies it against the password they typed.

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//This custom middleware runs on every incoming request before hitting your actual routes
//In Express.js, res.locals is a built-in object used to store variables that are local to a specific request
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); ///listings/:id/reviews => parent route
app.use("/", userRouter);
//
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
// NEW API ROUTE — yahan add karo
app.get("/api/foods", async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch food items",
    });
  }
});

// Error handling
app.all("{*path}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { status = 500, message = "some error Occured" } = err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("server is listining to port 8080");
});
