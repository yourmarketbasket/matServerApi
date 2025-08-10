/**
 * @description Middleware factory to authorize users based on their permissions.
 * This should be used *after* the 'protect' middleware has run.
 * @param {...string} requiredPermissions - A list of permission numbers required to access the route.
 * @returns {function} Express middleware function
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.staff) {
      return res.status(403).json({
        success: false,
        message: 'Staff member not found. Authorization check failed.'
      });
    }

    // If staff member is a superuser, grant access immediately without checking permissions.
    if (req.staff.role === 'superuser') {
      return next();
    }

    const userPermissions = req.staff.permissions || [];

    const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `User does not have the required permissions to access this route.`,
      });
    }

    console.log(`Middleware: User with permissions [${userPermissions.join(', ')}] authorized for route requiring one of [${requiredPermissions.join(', ')}].`);
    next();
  };
};

module.exports = { authorize };
