const HttpRequestLog = require('../models/httpRequestLog.model');
const config = require('../../config');

const rateLimitMiddleware = async (req, res, next) => {
  // Do not rate limit if the feature is disabled or not configured
  if (!config.rateLimit || !config.rateLimit.windowMs || !config.rateLimit.maxRequests) {
    return next();
  }

  try {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = new Date(now - config.rateLimit.windowMs);

    const requestCount = await HttpRequestLog.countDocuments({
      ipAddress: ip,
      timestamp: { $gte: windowStart }
    });

    if (requestCount >= config.rateLimit.maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.'
      });
    }

    next();
  } catch (error) {
    // If the rate limiter encounters an error (e.g., database issue),
    // we should log the error and let the request proceed.
    // Failing open is safer than blocking legitimate traffic.
    console.error('Error in rate limiting middleware:', error);
    next();
  }
};

module.exports = rateLimitMiddleware;
