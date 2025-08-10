const BusOperatorService = require('../services/busOperator.service');

/**
 * @class BusOperatorController
 * @description Controller for bus operator management operations
 */
class BusOperatorController {
  async registerOperator(req, res, next) {
    try {
      req.body.createdBy = req.staff._id;
      const operator = await BusOperatorService.registerOperator(req.body);
      res.status(201).json({ success: true, data: operator });
    } catch (error) {
      next(error);
    }
  }

  async getOperators(req, res, next) {
    try {
      const operators = await BusOperatorService.getOperators();
      res.status(200).json({ success: true, data: operators });
    } catch (error) {
      next(error);
    }
  }

  async getOperatorById(req, res, next) {
    try {
      const { id } = req.params;
      const operator = await BusOperatorService.getOperatorById(id);
      res.status(200).json({ success: true, data: operator });
    } catch (error) {
      next(error);
    }
  }

  async updateOperatorStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const operator = await BusOperatorService.updateOperatorStatus(id, status);
      res.status(200).json({ success: true, data: operator });
    } catch (error) {
      next(error);
    }
  }

  async updateOperator(req, res, next) {
    try {
      const { id } = req.params;
      const operator = await BusOperatorService.updateOperator(id, req.body);
      res.status(200).json({ success: true, data: operator });
    } catch (error) {
      next(error);
    }
  }

  async deleteOperator(req, res, next) {
    try {
      const { id } = req.params;
      await BusOperatorService.deleteOperator(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BusOperatorController();
