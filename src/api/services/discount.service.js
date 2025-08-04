const Discount = require('../models/discount.model');

/**
 * @class DiscountService
 * @description Manages business logic for discounts
 */
class DiscountService {
  /**
   * @description Creates a new discount
   * @param {object} discountData - The data for the new discount
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createDiscount(discountData, io) {
    const discount = await Discount.create(discountData);
    io.to(discount.saccoId.toString()).emit('discountCreated', { discount });
    return { discount };
  }

  /**
   * @description Updates an existing discount
   * @param {string} id - The ID of the discount to update
   * @param {object} discountData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateDiscount(id, discountData, io) {
    const discount = await Discount.findByIdAndUpdate(id, discountData, { new: true });
    io.to(discount.saccoId.toString()).emit('discountUpdated', { discount });
    return { discount };
  }

  /**
   * @description Deletes a discount
   * @param {string} id - The ID of the discount to delete
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<void>}
   */
  async deleteDiscount(id, io) {
    const discount = await Discount.findByIdAndDelete(id);
    if (discount) {
      io.to(discount.saccoId.toString()).emit('discountDeleted', { discountId: id });
    }
  }

  /**
   * @description Retrieves all discounts for a given Sacco
   * @param {string} saccoId - The ID of the Sacco
   * @returns {Promise<Array<object>>}
   */
  async getDiscounts(saccoId) {
    const discounts = await Discount.find({ saccoId });
    return { discounts };
  }
}

module.exports = new DiscountService();
