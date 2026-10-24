const express = require("express");
const router = express.Router({ mergeParams: true }); //to preserve the path parameters (req.params) from the parent router when you split your routes into separate files.
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/food.js");
const {
  validateReview,
  isLoggedIn,
  isreviewAuthor,
} = require("../middleware.js");
//Reviews
//Post Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Food not found!");
      return res.redirect("/listings");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.food = listing._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }),
);
// Delete Review Route
router.delete(
  "/:reviewId",
  isreviewAuthor,
  wrapAsync(async (req, res) => {
    // "/:reviewId" =>child route
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //$pull=>listing ke reviews array me se reviewId ko pull karo and delete
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
  }),
);
module.exports = router;
