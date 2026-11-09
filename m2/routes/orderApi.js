const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order.js");
const Cart = require("../models/cart.js");
const Food = require("../models/food.js");

// Middleware: only logged-in users can place orders
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Please login first.",
    });
  }

  next();
}

// POST /api/orders - Place a new order
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { name, phone, email, address, city, pincode, landmark } =
      req.body.deliveryAddress || {};

    // Validate delivery details
    if (!name || !phone || !email || !address || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required delivery details.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain 10 digits.",
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "PIN code must contain 6 digits.",
      });
    }

    // Get the logged-in user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // Fetch current food details from database
    const foodIds = cart.items.map((item) => item.food);
    const foods = await Food.find({
      _id: { $in: foodIds },
    });

    // Create a lookup map for food details
    const foodMap = new Map(foods.map((food) => [food._id.toString(), food]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const food = foodMap.get(item.food.toString());

      if (!food) {
        return res.status(400).json({
          success: false,
          message: "A food item in your cart is no longer available.",
        });
      }

      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
      });

      subtotal += food.price * item.quantity;
    }

    const deliveryFee = 40;
    const total = subtotal + deliveryFee;

    // Save order in MongoDB
    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      deliveryAddress: {
        name,
        phone,
        email,
        address,
        city,
        pincode,
        landmark: landmark || "",
      },
      paymentMethod: "COD",
      subtotal,
      deliveryFee,
      total,
    });

    await newOrder.save();

    // Clear cart only after order is successfully saved
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/my-orders
// Get all orders of the logged-in user

router.get("/my-orders", isLoggedIn, async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
});
// GET /api/orders/:orderId
// Get details of one order belonging to the logged-in user

router.get("/:orderId", isLoggedIn, async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // Find order belonging to the logged-in user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
