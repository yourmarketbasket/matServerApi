const CryptoJS = require('crypto-js');
const config = require('../../config');

const {
  cryptoSecretKey,
  initializationVector,
  cryptoPadding,
  cryptoMode,
  cryptoAlgorithm,
} = config;

if (!cryptoSecretKey || !initializationVector || !cryptoPadding || !cryptoMode || !cryptoAlgorithm) {
  throw new Error('Missing one or more required crypto environment variables.');
}

// Map string config values to CryptoJS objects
const PADDING_MAP = {
  PKCS7: CryptoJS.pad.Pkcs7,
  NoPadding: CryptoJS.pad.NoPadding,
};

const MODE_MAP = {
  CBC: CryptoJS.mode.CBC,
  ECB: CryptoJS.mode.ECB,
};

const secretKey = CryptoJS.enc.Utf8.parse(cryptoSecretKey);
const iv = CryptoJS.enc.Hex.parse(initializationVector);
const padding = PADDING_MAP[cryptoPadding];
const mode = MODE_MAP[cryptoMode];

/**
 * @description Encrypts a string using the configured algorithm, mode, and padding.
 * @param {string} text - The text to encrypt.
 * @returns {string} The encrypted text.
 */
const encrypt = (text) => {
  const encrypted = CryptoJS.AES.encrypt(text, secretKey, {
    iv: iv,
    padding: padding,
    mode: mode,
  });
  return encrypted.toString();
};

/**
 * @description Decrypts a string using the configured algorithm, mode, and padding.
 * @param {string} encryptedText - The text to decrypt.
 * @returns {string} The decrypted text.
 */
const decrypt = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey, {
    iv: iv,
    padding: padding,
    mode: mode,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
