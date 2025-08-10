const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../models/user.model');

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

    // Attach user to the request object
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    // Check if the token was issued before the user's `tokenValidAfter` timestamp
    if (req.user.tokenValidAfter) {
      const tokenIssuedAt = decoded.iat * 1000;
      if (tokenIssuedAt < req.user.tokenValidAfter.getTime()) {
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
