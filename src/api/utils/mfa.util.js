const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

/**
 * @description Generates a new MFA secret and a data URL for a QR code
 * @param {string} email - The user's email to be used as the label in the authenticator app
 * @returns {{secret: string, qrCodeDataUrl: string}}
 */
const generateMfaSecret = async (email) => {
  const secret = speakeasy.generateSecret({
    name: `SafarEasy (${email})`,
  });

  const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCodeDataUrl,
  };
};

/**
 * @description Verifies a TOTP token against a user's MFA secret
 * @param {string} secret - The user's MFA secret (in base32)
 * @param {string} token - The TOTP token from the authenticator app
 * @returns {boolean} True if the token is valid, false otherwise
 */
const verifyMfaToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
  });
};

module.exports = {
  generateMfaSecret,
  verifyMfaToken,
};
