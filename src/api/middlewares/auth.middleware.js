const jwt = require('jsonwebtoken');
const config = require('../../config');
const Staff = require('../models/staff.model');

/**
 * @description Middleware to protect routes by verifying a JWT.
 * It assumes the token is sent in the 'Authorization' header as a Bearer token.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Attach staff member to the request object
    req.staff = await Staff.findById(decoded.id).select('-password');

    if (!req.staff) {
        return res.status(401).json({ success: false, message: 'Not authorized, staff member not found' });
    }

    // Check if the token was issued before the staff member's `tokenValidAfter` timestamp
    if (req.staff.tokenValidAfter) {
      const tokenIssuedAt = decoded.iat * 1000;
      if (tokenIssuedAt < req.staff.tokenValidAfter.getTime()) {
        return res.status(401).json({ success: false, message: 'Token has been invalidated, please log in again.' });
      }
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
