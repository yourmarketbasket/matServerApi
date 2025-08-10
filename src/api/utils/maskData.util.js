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
 * Prevents infinite recursion by tracking visited objects.
 * @param {*} data - The data to sanitize (object, array, or primitive).
 * @param {WeakSet} [visited] - Tracks visited objects to prevent infinite recursion.
 * @returns {*} The sanitized data.
 */
function maskData(data, visited = new WeakSet()) {
  // Return primitives and null as is
  if (data === null || typeof data !== 'object') {
    return data;
  }

  // Check for circular reference
  if (visited.has(data)) {
    return '[Circular]';
  }

  // Add current object to visited set
  if (!Array.isArray(data)) {
    visited.add(data);
  }

  // Handle arrays by mapping over them and calling maskData recursively
  if (Array.isArray(data)) {
    return data.map(item => maskData(item, visited));
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
        maskedObject[key] = maskData(data[key], visited);
      }
    }
  }
  return maskedObject;
}

module.exports = maskData;
