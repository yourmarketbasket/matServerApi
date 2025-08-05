const dotenv = require('dotenv');

// Load env vars
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  adminKey: process.env.ADMIN_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  cryptoSecretKey: process.env.CRYPTO_SECRET_KEY,
  initializationVector: process.env.INITIALIZATION_VECTOR,
  cryptoPadding: process.env.CRYPTO_PADDING,
  cryptoMode: process.env.CRYPTO_MODE,
  cryptoAlgorithm: process.env.CRYPTO_ALGORITHM,
};
