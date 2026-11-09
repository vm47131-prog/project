require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user.js");

async function createSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    const existingSuperAdmin = await User.findOne({
      role: "super_admin",
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");
      return;
    }

    const username = process.env.SUPER_ADMIN_USERNAME;
    const email = process.env.SUPER_ADMIN_EMAIL;
    const phone = process.env.SUPER_ADMIN_PHONE;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!username || !email || !phone || !password) {
      throw new Error("Super Admin environment variables are missing.");
    }

    const superAdmin = new User({
      username,
      email,
      phone,
      role: "super_admin",
      ownerStatus: "not_applicable",
      permissions: [],
    });

    await User.register(superAdmin, password);

    console.log("Super Admin created successfully!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createSuperAdmin();
