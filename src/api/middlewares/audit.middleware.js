const HttpRequestLogService = require('../services/httpRequestLog.service');

const auditMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const originalJson = res.json;
  const originalSend = res.send;
  let responseBody = null;

  // Intercept res.json to capture the response body
  res.json = function (body) {
    responseBody = body;
    return originalJson.apply(res, arguments);
  };

  // Intercept res.send to capture the response body
  res.send = function (body) {
    responseBody = body;
    return originalSend.apply(res, arguments);
  };

  res.on('finish', () => {
    const endTime = Date.now();
    const processingTime = endTime - startTime;

    const logData = {
      user: req.user ? req.user.id : null,
      ipAddress: req.ip,
      method: req.method,
      url: req.originalUrl,
      requestPayload: req.body,
      responsePayload: responseBody,
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
