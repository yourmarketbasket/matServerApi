const CryptoJS = require('crypto-js');

const secretKey = 'X7pL9qW3zT2mK8rY6nJ4vC5bH0tD2gF';
const iv = '1a2b3c4d5e6f7890a1b2c3d4e5f60789';

const key = CryptoJS.enc.Utf8.parse(secretKey);
const ivHex = CryptoJS.enc.Hex.parse(iv);

/**
 * @description Encrypts a string using AES-256-CBC
 * @param {string} text - The text to encrypt
 * @returns {string} The Base64-encoded encrypted text
 */
const encrypt = (text) => {
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: ivHex,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return encrypted.toString();
};

/**
 * @description Decrypts a Base64-encoded string using AES-256-CBC
 * @param {string} encryptedText - The Base64-encoded text to decrypt
 * @returns {string} The decrypted text
 */
const decrypt = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: ivHex,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
