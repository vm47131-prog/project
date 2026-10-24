const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  category: {
    type: String,
    required: true,
  },

  restaurant: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  deliveryTime: {
    type: String,
    default: "30-40 min",
  },

  isVeg: {
    type: Boolean,
    default: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
