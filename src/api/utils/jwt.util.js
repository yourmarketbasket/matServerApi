const jwt = require('jsonwebtoken');
const config = require('../../config');

/**
 * @description Generates a signed JWT for a given user ID
 * @param {string} id - The user's ID to include in the token payload
 * @returns {string} The signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

module.exports = {
  generateToken,
};
