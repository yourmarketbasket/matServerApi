const Loyalty = require('../models/loyalty.model');

/**
 * @class LoyaltyService
 * @description Manages loyalty points for users
 */
class LoyaltyService {
  /**
   * @description Adds loyalty points to a user's account after a completed trip
   * @param {string} userId
   * @param {string} ticketId
   * @param {number} points
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async earnPoints(userId, ticketId, points, io) {
    const loyalty = await Loyalty.findOneAndUpdate(
      { userId },
      { $inc: { points }, $push: { transactions: { type: 'earned', points, ticketId } } },
      { new: true, upsert: true }
    );
    io.to(userId).emit('loyaltyUpdated', { loyalty });
    return { loyalty };
  }

  /**
   * @description Redeems loyalty points for a discount or other reward
   * @param {string} userId
   * @param {string} ticketId
   * @param {number} points
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async redeemPoints(userId, ticketId, points, io) {
    const loyalty = await Loyalty.findOneAndUpdate(
      { userId, points: { $gte: points } }, // Ensure user has enough points
      { $inc: { points: -points }, $push: { transactions: { type: 'redeemed', points, ticketId } } },
      { new: true }
    );

    if (!loyalty) {
      throw new Error('Insufficient points or user not found.');
    }

    io.to(userId).emit('loyaltyUpdated', { loyalty });
    return { loyalty };
  }

  /**
   * @description Retrieves the loyalty account details for a user
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async getLoyalty(userId) {
    const loyalty = await Loyalty.findOne({ userId });
    return { loyalty };
  }
}

module.exports = new LoyaltyService();
