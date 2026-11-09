const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});
//SignUp
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    try {
      let { username, email, phone, password } = req.body.User;
      const newUser = new User({
        username,
        email,
        phone,
      });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
}); //passport.authenticate() is the middleware used to verify user credentials (like username/email and password) during login and establish a session.
router.post(
  "/login", //"The moment passport.authenticate() runs, it automatically clears and resets the existing req.session object."
  saveRedirectUrl,
  passport.authenticate("local", {
    //The 'local' string specifies the Passport strategy you want to use for authentication.
    failureRedirect: "/login", // ex:=>  passport.authenticate('google')   // Triggers Google OAuth login
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); //req.session.redirectUrl is undefined (empty). As passport reset the session and delete the redirctUrl
  },
); //req.locals does not exist. You must always use res.locals.
//LOGOUT
router.get("/logout", (req, res, next) => {
  //In Passport.js, req.logout() is a built-in method used to terminate a user session.
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
});
module.exports = router;
