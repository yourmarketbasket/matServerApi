const Owner = require('../models/owner.model');

/**
 * @class OwnerService
 * @description Handles business logic for Owners
 */
class OwnerService {
  /**
   * @description Updates an Owner's approval status
   * @param {string} id - The ID of the Owner to update
   * @param {string} status - The new approval status
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateOwnerStatus(id, status, io) {
    const owner = await Owner.findByIdAndUpdate(id, { approvedStatus: status }, { new: true });
    io.emit('ownerStatusChanged', { ownerId: id, status });
    return { owner };
  }
}

module.exports = new OwnerService();
