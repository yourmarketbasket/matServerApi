const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * @description Generates a signed JWT for a given user object
 * @param {object} user - The user object, must contain _id and role
 * @returns {string} The signed JWT
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

module.exports = {
  generateToken,
};
