const cryptoUtil = require('../utils/crypto.util');

/**
 * @description Middleware to handle end-to-end encryption.
 * It decrypts incoming request bodies and encrypts outgoing responses.
 */
const encryptionMiddleware = (req, res, next) => {
  // 1. Decrypt incoming request body
  if (req.body && req.body.encryptedPayload) {
    try {
      const decryptedBody = cryptoUtil.decrypt(req.body.encryptedPayload);
      req.body = JSON.parse(decryptedBody);
    } catch (error) {
      console.error('Request decryption error:', error);
      return res.status(400).json({ success: false, message: 'Invalid encrypted payload.' });
    }
  }

  // 2. Wrap res.json to encrypt outgoing response
  const originalJson = res.json;
  res.json = function(data) {
    try {
      const encryptedData = cryptoUtil.encrypt(JSON.stringify(data));
      originalJson.call(this, { encryptedPayload: encryptedData });
    } catch (error) {
      console.error('Response encryption error:', error);
      // Avoid sending a nested error message which itself might fail to encrypt
      res.status(500).send('{"error":"Response encryption failed."}');
    }
  };

  next();
};

module.exports = { encryptionMiddleware };
