module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  adminKey: process.env.ADMIN_KEY,
  encryptionKey: process.env.ENCRYPTION_KEY,
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,    // Limit each IP to 100 requests per windowMs
  },
};
