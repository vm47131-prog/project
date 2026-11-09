const express = require("express");
const router = express.Router();

const Cart = require("../models/cart.js");
const Food = require("../models/food.js");

// GET: Logged-in user ka cart fetch karo
router.get("/", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.food",
    );

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// POST: Cart mein food add karo
router.post("/items", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const { foodId, quantity = 1 } = req.body;

    if (!foodId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid foodId and quantity are required.",
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ food: foodId, quantity });
    }

    await cart.save();
    await cart.populate("items.food");

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// PATCH: Quantity update karo
router.patch("/items/:foodId", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (entry) => entry.food.toString() === req.params.foodId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Food item not found in cart.",
      });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.food");

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// DELETE: Cart se food remove karo
router.delete("/items/:foodId", async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== req.params.foodId,
    );

    await cart.save();
    await cart.populate("items.food");

    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
