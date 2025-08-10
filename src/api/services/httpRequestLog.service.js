const HttpRequestLog = require('../models/httpRequestLog.model');

/**
 * @class HttpRequestLogService
 * @description Handles the business logic for logging HTTP requests.
 */
class HttpRequestLogService {
  /**
   * @description Creates a new HTTP request log entry.
   * @param {object} logData - The data for the log entry.
   * @returns {Promise<void>}
   */
  static async createLog(logData) {
    try {
      await HttpRequestLog.create(logData);
    } catch (error) {
      // We log the error to the console but do not throw it,
      // as a failure to log should not cause the original request to fail.
      console.error('Failed to create HTTP request log:', error);
    }
  }
}

module.exports = HttpRequestLogService;
