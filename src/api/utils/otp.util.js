const crypto = require('crypto');

/**
 * @description Generates a 6-character alphanumeric OTP.
 * @returns {string} The generated OTP.
 */
const generateOTP = () => {
  // We need 3 bytes to get 6 hex characters
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

module.exports = {
  generateOTP,
};
