const HttpRequestLogService = require('../services/httpRequestLog.service');
const maskData = require('../utils/maskData.util');

const auditMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const originalJson = res.json;
  const originalSend = res.send;
  let responseBodyForLogging = null;

  // Intercept res.json to capture and sanitize the response body
  res.json = function (body) {
    responseBodyForLogging = maskData(body);
    return originalJson.apply(res, arguments);
  };

  // Intercept res.send to capture and sanitize the response body
  res.send = function (body) {
    try {
      // If body is a string, try to parse it as JSON before masking
      const parsedBody = JSON.parse(body);
      responseBodyForLogging = maskData(parsedBody);
    } catch (error) {
      // If it's not a valid JSON string, we cannot safely mask it.
      // We'll log it as is, assuming it doesn't contain sensitive object structures.
      responseBodyForLogging = body;
    }
    return originalSend.apply(res, arguments);
  };

  res.on('finish', () => {
    const endTime = Date.now();
    const processingTime = endTime - startTime;

    // Sanitize the request body for logging
    const requestPayloadForLogging = maskData(req.body);

    const logData = {
      user: req.user ? req.user.id : null,
      ipAddress: req.ip,
      method: req.method,
      url: req.originalUrl,
      requestPayload: requestPayloadForLogging,
      responsePayload: responseBodyForLogging,
      statusCode: res.statusCode,
      isSuccess: res.statusCode >= 200 && res.statusCode < 300,
      timestamp: new Date(startTime),
      processingTime: processingTime,
    };

    // Asynchronously log the data without waiting for it to complete
    HttpRequestLogService.createLog(logData);
  });

  next();
};

module.exports = auditMiddleware;
