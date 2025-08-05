const CryptoJS = require('crypto-js');
const config = require('../../config');

const rawKey = config.encryptionKey;
// prepare the keys

if (!rawKey) {
  throw new Error('An ENCRYPTION_KEY must be provided in the environment variables.');
}

// Derive a 32-byte key from the user's secret using SHA-256.
// This allows the user to provide a key of any length.
const secretKey = CryptoJS.SHA256(rawKey);

/**
 * @description Encrypts a string using AES-256
 * @param {string} text - The text to encrypt
 * @returns {string} The encrypted text (iv:encryptedData)
 */
const encrypt = (text) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, secretKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString();
};

/**
 * @description Decrypts a string using AES-256
 * @param {string} encryptedText - The text to decrypt (iv:encryptedData)
 * @returns {string} The decrypted text
 */
const decrypt = (encryptedText) => {
  const parts = encryptedText.split(':');
  const iv = CryptoJS.enc.Hex.parse(parts.shift());
  const encryptedData = parts.join(':');
  const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
