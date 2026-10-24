const express = require("express");
const router = express.Router();
const Listing = require("../models/food.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index } = require("../controllers/listings.js");
//Index Route
router.get("/", wrapAsync(index));
// new Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new"); //listings ke andar new.ejs par render kar raha hai
});
//insert route                 //first validate then next call
router.post(
  "/insertnew",
  validateListing,
  wrapAsync(async (req, res, next) => {
    //   console.log(req.body);
    let samplelisting = new Listing(req.body.listing);
    samplelisting.owner = req.user._id; //user=> current loggedin user
    await samplelisting.save();
    req.flash("success", "New Food Item added Created !");
    res.redirect("/listings");
  }),
);
// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      });

    if (!listing) {
      req.flash("error", "Food you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {
      food: listing,
      currUser: req.user,
    });
  }),
);
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const food = await Listing.findById(id);
    if (!food) {
      req.flash("error", "Requested food Item  does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { food });
  }),
);
//update route
router.put(
  "/:id/update",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body) {
      // custom error message
      throw new ExpressError(400, "Send valid data for food Item");
    }
    let { id } = req.params;
    let samplelisting = req.body.listing;
    await Listing.findByIdAndUpdate(id, samplelisting); //IMP
    req.flash("success", "Food Item Updated !");
    res.redirect(`/listings/${id}`);
  }),
);
//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
  }),
);
module.exports = router;
