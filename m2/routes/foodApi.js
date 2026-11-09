const express = require("express");
const router = express.Router();
const Food = require("../models/food");
const Restaurant = require("../models/restaurant");

// ---------------------------------------------
// factory function
// ---------------------------------------------
function requireFoodAccess(permission) {
  return (req, res, next) => {
    // Step 1: Authentication check
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const role = req.user.role;

    // Step 2: Super Admin
    if (role === "super_admin") {
      return next();
    }

    // Step 3: Owner
    // Restaurant ownership will be verified in route
    if (role === "owner") {
      return next();
    }

    // Step 4: Admin permission check
    if (role === "admin") {
      const permissions = req.user.permissions || [];

      if (permissions.includes(permission)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `You do not have permission: ${permission}`,
      });
    }

    // Step 5: Other roles
    return res.status(403).json({
      success: false,
      message: "Access denied.",
    });
  };
}

// ---------------------------------------------
// Helper: Get Owner's Restaurant
// ---------------------------------------------
async function getOwnerRestaurant(userId) {
  return Restaurant.findOne({ owner: userId });
}

// ---------------------------------------------
// GET: All Food Items
// ---------------------------------------------
router.get("/foods", requireFoodAccess("food.view"), async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "owner") {
      const restaurant = await getOwnerRestaurant(req.user._id);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Restaurant not found.",
        });
      }

      query.restaurant = restaurant._id.toString();
    }

    // Admin and Super Admin can see all foods
    const foods = await Food.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch food items.",
      error: error.message,
    });
  }
});

// ---------------------------------------------
// POST: Create Food Item
// ---------------------------------------------
router.post("/foods", requireFoodAccess("food.create"), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurant: restaurantId,
      deliveryTime,
      isVeg,
    } = req.body;

    // Validation
    if (!name?.trim() || !description?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, description and category are required.",
      });
    }

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number greater than or equal to 0.",
      });
    }

    let restaurant;

    // Owner: Automatically use own restaurant
    if (req.user.role === "owner") {
      restaurant = await getOwnerRestaurant(req.user._id);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Your restaurant was not found.",
        });
      }
    } else {
      // Admin / Super Admin: Restaurant must be selected
      if (!restaurantId) {
        return res.status(400).json({
          success: false,
          message: "Please select a restaurant.",
        });
      }

      restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "Selected restaurant not found.",
        });
      }
    }

    const food = new Food({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),

      // Restaurant association
      restaurant: restaurant._id.toString(),

      deliveryTime: deliveryTime || "30-40 min",
      isVeg: isVeg === undefined ? true : isVeg,

      // Actual restaurant owner, not Admin creator
      owner: restaurant.owner,
    });

    await food.save();

    return res.status(201).json({
      success: true,
      message: "Food item created successfully.",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create food item.",
      error: error.message,
    });
  }
});

// ---------------------------------------------
// PUT: Update Food Item
// ---------------------------------------------
router.put("/foods/:id", requireFoodAccess("food.edit"), async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
    }

    // Owner can update only own restaurant's food
    if (req.user.role === "owner") {
      const restaurant = await getOwnerRestaurant(req.user._id);

      if (!restaurant || food.restaurant !== restaurant._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can update only your restaurant's food items.",
        });
      }
    }

    const { name, description, price, category, deliveryTime, isVeg } =
      req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }

      food.name = name.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty.",
        });
      }

      food.description = description.trim();
    }

    if (category !== undefined) {
      if (!category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category cannot be empty.",
        });
      }

      food.category = category.trim();
    }

    if (price !== undefined) {
      if (
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number >= 0.",
        });
      }

      food.price = Number(price);
    }

    if (deliveryTime !== undefined) {
      food.deliveryTime = deliveryTime;
    }

    if (isVeg !== undefined) {
      food.isVeg = isVeg;
    }

    // Restaurant and owner are intentionally not changed here
    await food.save();

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully.",
      food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update food item.",
      error: error.message,
    });
  }
});

// ---------------------------------------------
// DELETE: Delete Food Item
// ---------------------------------------------
router.delete(
  "/foods/:id",
  requireFoodAccess("food.delete"),
  async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: "Food item not found.",
        });
      }

      // Owner can delete only own restaurant's food
      if (req.user.role === "owner") {
        const restaurant = await getOwnerRestaurant(req.user._id);

        if (!restaurant || food.restaurant !== restaurant._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "You can delete only your restaurant's food items.",
          });
        }
      }

      await Food.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Food item deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete food item.",
        error: error.message,
      });
    }
  },
);

module.exports = router;
