const jwt = require('jsonwebtoken');
const config = require('../../config');
const Staff = require('../models/staff.model');
const Passenger = require('../models/passenger.model');
// Import other user type models as they are created
// const Driver = require('../models/driver.model');
// const Sacco = require('../models/sacco.model');
// const Owner = require('../models/owner.model');
// const QueueManager = require('../models/queueManager.model');

const userModels = {
  staff: Staff,
  passenger: Passenger,
  // driver: Driver,
  // sacco: Sacco,
  // owner: Owner,
  // queueManager: QueueManager,
};

/**
 * @description Middleware to protect routes by verifying a JWT.
 * It is polymorphic and can handle different user types.
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
    const { id, userType } = decoded;

    if (!userType || !userModels[userType]) {
      return res.status(401).json({ success: false, message: 'Invalid token: unknown user type' });
    }

    const UserModel = userModels[userType];
    const user = await UserModel.findById(id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }

    // Attach user object and userType to the request for downstream middleware/controllers
    req.user = user;
    req.userType = userType;

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
