const PayrollService = require('../services/payroll.service');

/**
 * @class PayrollController
 * @description Controller for payroll management
 */
class PayrollController {
  async createPayroll(req, res, next) {
    try {
      const { tripId } = req.body;
      const result = await PayrollService.processPayroll(tripId, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerPayrolls(req, res, next) {
    try {
      const { ownerId } = req.params;
      const result = await PayrollService.getPayrollByOwner(ownerId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getDriverPayrolls(req, res, next) {
    try {
      const { driverId } = req.params;
      const result = await PayrollService.getPayrollByDriver(driverId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async resolvePayroll(req, res, next) {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      const result = await PayrollService.resolvePayrollDispute(id, resolution, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PayrollController();
