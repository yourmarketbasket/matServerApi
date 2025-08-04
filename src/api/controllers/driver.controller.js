const DriverService = require('../services/driver.service');

/**
 * @class DriverController
 * @description Controller for driver management
 */
class DriverController {
  async createDriver(req, res, next) {
    try {
      const result = await DriverService.createDriver(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getDrivers(req, res, next) {
    try {
      const { saccoId } = req.params;
      const result = await DriverService.getDriversBySacco(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateDriver(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DriverService.updateDriver(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPerformance(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DriverService.getDriverPerformance(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverController();
