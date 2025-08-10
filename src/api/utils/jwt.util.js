const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * @description Generates a signed JWT for a given user object and type
 * @param {object} user - The user object, must contain _id and role
 * @param {string} userType - The type of user (e.g., 'staff', 'passenger')
 * @returns {string} The signed JWT
 */
const generateToken = (user, userType) => {
  const payload = {
    id: user._id,
    role: user.role,
    userType: userType,
  };
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

module.exports = {
  generateToken,
};
