const AnalyticsService = require('../services/analytics.service');

/**
 * @class AnalyticsController
 * @description Controller for analytics and reporting
 */
class AnalyticsController {
  async getSaccoRevenue(req, res, next) {
    try {
      const { saccoId } = req.params;
      const { startDate, endDate } = req.query;
      const result = await AnalyticsService.calculateRevenueBySacco(saccoId, startDate, endDate);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerRevenue(req, res, next) {
    try {
      const { ownerId } = req.params;
      const { startDate, endDate } = req.query;
      const result = await AnalyticsService.calculateRevenueByOwner(ownerId, startDate, endDate);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getCancellationStats(req, res, next) {
    try {
      const { routeId } = req.params;
      const result = await AnalyticsService.calculateCancellationStats(routeId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPayrollAccuracy(req, res, next) {
    try {
      const { saccoId } = req.params;
      const result = await AnalyticsService.calculatePayrollAccuracy(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getLoyaltyUsage(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await AnalyticsService.calculateLoyaltyUsage(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getUserRegistrationStats(req, res, next) {
    try {
      const { period } = req.query;
      const result = await AnalyticsService.getUserRegistrationStats(period);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
