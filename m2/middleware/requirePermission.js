module.exports = function requirePermission(permission) {
  //factory function => return a function
  return function (req, res, next) {
    // Check whether user is logged in
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const user = req.user;

    // Super Admin has full access
    if (user.role === "super_admin") {
      return next();
    }

    // Only admins can use admin permissions
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    // Check assigned permission
    if (!user.permissions || !user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission for this action.",
      });
    }

    // Permission granted
    next();
  };
};
