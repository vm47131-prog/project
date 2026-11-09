const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // Customer, Restaurant Owner or Admin
  role: {
    type: String,
    enum: ["customer", "owner", "admin", "super_admin"],
    default: "customer",
  },

  // Restaurant Owner Approval Status
  ownerStatus: {
    type: String,
    enum: ["not_applicable", "pending", "approved", "rejected"],
    default: "not_applicable",
  },
  permissions: {
    type: [String],
    default: [],
  },

  rejectionReason: {
    type: String,
    default: null,
    trim: true,
  },
});

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
