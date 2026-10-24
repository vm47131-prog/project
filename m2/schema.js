const Joi = require("joi");
// Food validation
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    restaurant: Joi.string().required(),
    rating: Joi.number().min(0).max(5),
    deliveryTime: Joi.string(),
    isVeg: Joi.boolean(),
  }).required(),
});

// Review validation
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
