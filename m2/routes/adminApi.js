const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const requirePermission = require("../middleware/requirePermission.js");
const requireSuperAdmin = require("../middleware/requireSuperAdmin.js");

// View pending restaurant owner applications
router.get(
  "/owners/pending",
  requirePermission("owner.view"),
  async (req, res) => {
    try {
      const pendingOwners = await User.find({
        role: "owner",
        ownerStatus: "pending",
      }).select("username email phone ownerStatus");

      res.json({
        success: true,
        count: pendingOwners.length,
        owners: pendingOwners,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending owners.",
      });
    }
  },
);

// Approve a restaurant owner
router.patch(
  "/owners/:id/approve",
  requirePermission("owner.approve"),
  async (req, res) => {
    try {
      const approvedOwner = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          role: "owner",
          ownerStatus: "pending",
        },
        {
          $set: {
            ownerStatus: "approved",
          },
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      ).select("username email phone ownerStatus");

      if (!approvedOwner) {
        return res.status(404).json({
          success: false,
          message: "Pending owner not found.",
        });
      }

      res.json({
        success: true,
        message: "Restaurant owner approved successfully.",
        owner: approvedOwner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to approve owner.",
      });
    }
  },
);

// Reject a restaurant owner
router.patch(
  "/owners/:id/reject",
  requirePermission("owner.reject"),
  async (req, res) => {
    try {
      const { reason } = req.body;

      if (!reason || !reason.trim()) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required.",
        });
      }

      const rejectedOwner = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          role: "owner",
          ownerStatus: "pending",
        },
        {
          $set: {
            ownerStatus: "rejected",
            rejectionReason: reason.trim(),
          },
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      ).select("username email phone ownerStatus rejectionReason");

      if (!rejectedOwner) {
        return res.status(404).json({
          success: false,
          message: "Pending owner not found.",
        });
      }

      res.json({
        success: true,
        message: "Restaurant owner rejected successfully.",
        owner: rejectedOwner,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to reject owner.",
      });
    }
  },
);
// Create a new Admin (Super Admin only)
router.post("/admins", requireSuperAdmin, async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Check required fields
    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, phone and password are required.",
      });
    }

    // Create Admin user
    const newAdmin = new User({
      username,
      email,
      phone,
      role: "admin",
      permissions: [],
    });

    // Register user with hashed password
    const registeredAdmin = await User.register(newAdmin, password);

    res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      admin: {
        _id: registeredAdmin._id,
        username: registeredAdmin.username,
        email: registeredAdmin.email,
        phone: registeredAdmin.phone,
        role: registeredAdmin.role,
        permissions: registeredAdmin.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create admin. Email, phone or username may already exist.",
    });
  }
});

// Assign permissions to an Admin (Super Admin only)
router.patch("/admins/:id/permissions", requireSuperAdmin, async (req, res) => {
  try {
    const { permissions } = req.body;

    // Validate permissions
    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array.",
      });
    }

    // Allowed permissions
    const allowedPermissions = ["owner.view", "owner.approve", "owner.reject"];

    const invalidPermissions = permissions.filter(
      (permission) => !allowedPermissions.includes(permission),
    );

    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid permissions provided.",
        invalidPermissions,
      });
    }

    // Update only an Admin account
    const updatedAdmin = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "admin",
      },
      {
        $set: {
          permissions: [...new Set(permissions)],
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("username email phone role permissions");

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    res.json({
      success: true,
      message: "Admin permissions updated successfully.",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update admin permissions.",
    });
  }
});

// Get all Admins (Super Admin only)
router.get("/admins", requireSuperAdmin, async (req, res) => {
  try {
    const admins = await User.find({
      role: "admin",
    }).select("username email phone role permissions");

    res.json({
      success: true,
      count: admins.length,
      admins: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admins.",
    });
  }
});
// DELETE ADMIN - Super Admin only
router.delete("/admins/:id", requireSuperAdmin, async (req, res, next) => {
  try {
    const deletedAdmin = await User.findOneAndDelete({
      _id: req.params.id,
      role: "admin",
    }).select("username email phone role");

    if (!deletedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully.",
      deletedAdmin,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
