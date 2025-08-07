// const jwt = require('jsonwebtoken');
// const config = require('../../config');
// const User = require('../models/user.model');

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
    // In a real app, you'd send an encrypted response.
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // In a real implementation:
    // const decoded = jwt.verify(token, config.jwtSecret);
    // req.user = await User.findById(decoded.id).select('-password');

    console.log('Middleware: JWT protection enabled.');
    // For now, attach a dummy user to the request object.
    // The role can be changed to test RBAC.
    req.user = { _id: 'dummyUserId', role: 'admin', permissions: ['P111'] };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
