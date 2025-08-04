const DiscountService = require('../services/discount.service');

/**
 * @class DiscountController
 * @description Controller for discount management
 */
class DiscountController {
  async createDiscount(req, res, next) {
    try {
      // req.body.saccoId = req.user.saccoId; // In a real app, this would be enforced
      const result = await DiscountService.createDiscount(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getDiscounts(req, res, next) {
    try {
      const { saccoId } = req.params;
      const result = await DiscountService.getDiscounts(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateDiscount(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DiscountService.updateDiscount(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteDiscount(req, res, next) {
    try {
      const { id } = req.params;
      await DiscountService.deleteDiscount(id, req.io);
      res.status(200).json({ success: true, message: 'Discount deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DiscountController();
