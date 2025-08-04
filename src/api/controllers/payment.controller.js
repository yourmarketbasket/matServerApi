const PaymentService = require('../services/payment.service');

/**
 * @class PaymentController
 * @description Controller for payment operations
 */
class PaymentController {
  async createPayment(req, res, next) {
    try {
      const result = await PaymentService.initiatePayment(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async confirmPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await PaymentService.confirmPayment(id, status, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSaccoPayments(req, res, next) {
    try {
      const { saccoId } = req.params;
      const result = await PaymentService.getPaymentsBySacco(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerPayments(req, res, next) {
    try {
      const { id } = req.params; // ownerId
      const result = await PaymentService.getPaymentsByOwner(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
