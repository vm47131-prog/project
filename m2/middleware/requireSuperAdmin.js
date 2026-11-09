module.exports = function requireSuperAdmin(req, res, next) {
  // Check whether user is logged in
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Please login first.",
    });
  }

  // Only Super Admin is allowed
  if (req.user.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Super Admin access required.",
    });
  }

  // Access granted
  next();
};
