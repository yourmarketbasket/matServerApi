/**
 * @description Middleware factory to authorize users based on their roles.
 * This should be used *after* the 'protect' middleware has run.
 * @param {...string} roles - A list of roles that are permitted to access the route.
 * @returns {function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: 'User not found. Authorization check failed.'
        });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route.`,
      });
    }

    console.log(`Middleware: User role '${req.user.role}' authorized for this route.`);
    next();
  };
};

module.exports = { authorize };
