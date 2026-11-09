const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/user.js");
const Restaurant = require("../models/restaurant.js");

// CUSTOMER SIGNUP

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;

    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newUser = new User({
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),

      // Customer role is fixed by backend
      role: "customer",
      ownerStatus: "not_applicable",
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      res.status(201).json({
        success: true,
        message: "Customer account created successfully!",
        user: {
          username: registeredUser.username,
          email: registeredUser.email,
          phone: registeredUser.phone,
          role: registeredUser.role,
          ownerStatus: registeredUser.ownerStatus,
        },
      });
    });
  } catch (err) {
    if (err.code === 11000 || err.name === "UserExistsError") {
      return res.status(409).json({
        success: false,
        message: "Username, email, or phone is already registered.",
      });
    }

    next(err);
  }
});

router.post("/owner-register", async (req, res, next) => {
  let session;

  try {
    const {
      username,
      email,
      phone,
      password,
      restaurantName,
      address,
      category,
    } = req.body;

    // 1. Validate all required fields
    if (
      !username?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !password ||
      !restaurantName?.trim() ||
      !address?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // 2. Start MongoDB session
    session = await mongoose.startSession();

    console.log("1. MongoDB session started");

    let registeredOwner;
    let newRestaurant;

    // 3. Start transaction
    await session.withTransaction(async () => {
      console.log("2. Transaction started");

      // Create owner
      const newOwner = new User({
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "owner",
        ownerStatus: "pending",
      });

      // Attach transaction session to User document
      newOwner.$session(session);

      console.log("3. Setting password...");

      await newOwner.setPassword(password);

      console.log("4. Password set successfully");

      registeredOwner = await newOwner.save({ session });

      console.log("5. Owner saved:", registeredOwner.username);

      // Create restaurant
      newRestaurant = new Restaurant({
        name: restaurantName.trim(),
        address: address.trim(),
        category: category.trim(),
        owner: registeredOwner._id,
      });

      // Save restaurant using same transaction
      await newRestaurant.save({ session });
      console.log("4. Restaurant saved");
    });

    // 4. Transaction committed. Now login owner.
    await new Promise((resolve, reject) => {
      console.log("5. Transaction committed");
      req.login(registeredOwner, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // 5. Send success response
    return res.status(201).json({
      success: true,
      message: "Owner registration successful! Waiting for admin approval.",
      user: {
        username: registeredOwner.username,
        email: registeredOwner.email,
        phone: registeredOwner.phone,
        role: registeredOwner.role,
        ownerStatus: registeredOwner.ownerStatus,
      },
      restaurant: {
        name: newRestaurant.name,
        address: newRestaurant.address,
        category: newRestaurant.category,
      },
    });
  } catch (err) {
    if (err.code === 11000 || err.name === "UserExistsError") {
      return res.status(409).json({
        success: false,
        message: "Username, email, or phone is already registered.",
      });
    }

    next(err);
  } finally {
    if (session) {
      await session.endSession();
    }
  }
});

//  LOGIN (CUSTOMER + OWNER + ADMIN)

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    User.authenticate()(user.username, password, (err, authenticatedUser) => {
      if (err) return next(err);

      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      req.login(authenticatedUser, (loginErr) => {
        if (loginErr) return next(loginErr);

        return res.json({
          success: true,
          message: "Login successful!",
          user: {
            username: authenticatedUser.username,
            email: authenticatedUser.email,
            phone: authenticatedUser.phone,
            role: authenticatedUser.role || "customer",
            ownerStatus: authenticatedUser.ownerStatus || "not_applicable",
          },
        });
      });
    });
  } catch (err) {
    next(err);
  }
});

// ================= CURRENT USER =================

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({
      success: true,
      user: null,
    });
  }

  res.json({
    success: true,
    user: {
      username: req.user.username,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role || "customer",
      ownerStatus: req.user.ownerStatus || "not_applicable",
    },
  });
});

// ================= LOGOUT =================

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((sessionErr) => {
      if (sessionErr) return next(sessionErr);

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        message: "Logged out successfully!",
      });
    });
  });
});

module.exports = router;
