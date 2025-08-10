const SENSITIVE_KEYS = [
  'password',
  'passwordconfirm',
  'newpassword',
  'mfasecret',
  'passwordresettoken',
  'token',
  'authorization',
  'authtoken',
  'access_token',
  'refresh_token',
];

/**
 * Recursively traverses an object or array and masks the values of sensitive keys.
 * @param {*} data - The data to sanitize (object, array, or primitive).
 * @returns {*} The sanitized data.
 */
function maskData(data) {
  // Return primitives and null as is
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Handle arrays by mapping over them and calling maskData recursively
  if (Array.isArray(data)) {
    return data.map(item => maskData(item));
  }

  // Handle objects by iterating over their keys
  // We create a new object to avoid mutating the original
  const maskedObject = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Check if the key (case-insensitive) is in our list of sensitive keys
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        maskedObject[key] = '********';
      } else {
        // If not sensitive, process its value recursively
        maskedObject[key] = maskData(data[key]);
      }
    }
  }
  return maskedObject;
}

module.exports = maskData;
