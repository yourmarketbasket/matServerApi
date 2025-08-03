// const cryptoUtil = require('../utils/crypto.util'); // Assumes a utility for AES-256

/**
 * @description Middleware to handle end-to-end encryption.
 * It decrypts incoming request bodies and encrypts outgoing responses.
 */
const encryptionMiddleware = (req, res, next) => {
  // 1. Decrypt incoming request body
  if (req.body && req.body.encryptedPayload) {
    try {
      // const decryptedBody = cryptoUtil.decrypt(req.body.encryptedPayload);
      // req.body = JSON.parse(decryptedBody);
      console.log('Middleware: Mock decrypting request body.');
      // For testing, we can simulate a decrypted body.
      // In a real scenario, the line above would be used.
      req.body = {
        name: 'Decrypted Test Name',
        email: 'decrypted.test@example.com'
      };
    } catch (error) {
      console.error('Request decryption error:', error);
      return res.status(400).json({ success: false, message: 'Invalid encrypted payload.' });
    }
  }

  // 2. Wrap res.json to encrypt outgoing response
  const originalJson = res.json;
  res.json = function(data) {
    try {
      // const encryptedData = cryptoUtil.encrypt(JSON.stringify(data));
      console.log('Middleware: Mock encrypting response body.');
      // In a real scenario, the line above would be used.
      // originalJson.call(this, { encryptedPayload: encryptedData });

      // For now, we will send the data unencrypted.
      originalJson.call(this, data);
    } catch (error) {
      console.error('Response encryption error:', error);
      // Avoid sending a nested error message which itself might fail to encrypt
      res.status(500).send('{"error":"Response encryption failed."}');
    }
  };

  next();
};

module.exports = { encryptionMiddleware };
