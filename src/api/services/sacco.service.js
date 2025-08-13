const Sacco = require('../models/sacco.model');

/**
 * @class SaccoService
 * @description Handles business logic for Saccos
 */
class SaccoService {
  /**
   * @description Creates a new Sacco
   * @param {object} saccoData - The data for the new Sacco
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createSacco(saccoData, io) {
    const sacco = await Sacco.create(saccoData);
    io.emit('saccoCreated', { sacco });
    return { sacco };
  }

  /**
   * @description Updates a Sacco's details
   * @param {string} id - The ID of the Sacco to update
   * @param {object} saccoData - The updated data
   * @returns {Promise<object>}
   */
  async updateSacco(id, saccoData) {
    const sacco = await Sacco.findByIdAndUpdate(id, saccoData, { new: true });
    return { sacco };
  }

  /**
   * @description Approves a pending Sacco
   * @param {string} id - The ID of the Sacco to approve
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async approveSacco(id, io) {
    const sacco = await Sacco.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    io.emit('saccoStatusChanged', { saccoId: id, status: 'approved' });
    return { sacco };
  }

  /**
   * @description Rejects a pending Sacco
   * @param {string} id - The ID of the Sacco to reject
   * @param {string} reason - The reason for rejection
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async rejectSacco(id, reason, io) {
    const sacco = await Sacco.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
    // In a real app, you might want to log the reason
    io.emit('saccoStatusChanged', { saccoId: id, status: 'rejected', reason });
    return { sacco };
  }

  /**
   * @description Updates a Sacco's approval status
   * @param {string} id - The ID of the Sacco to update
   * @param {string} status - The new approval status
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateSaccoStatus(id, status, io) {
    const sacco = await Sacco.findByIdAndUpdate(id, { approvedStatus: status }, { new: true });
    // In a real app, you might want to send a notification to the Sacco
    io.emit('saccoStatusChanged', { saccoId: id, status });
    return { sacco };
  }

  /**
   * @description Retrieves all Saccos
   * @returns {Promise<Array<object>>}
   */
  async getSaccos() {
    console.log('Fetching all Saccos');
    // TODO: Find all Saccos in the database
    return { saccos: [{ name: 'SafarEasy Demo Sacco', status: 'approved' }] };
  }

  /**
   * @description Retrieves all Sacco names and their IDs
   * @returns {Promise<Array<object>>}
   */
  async getSaccoNames() {
    const saccos = await Sacco.find({}).select('name _id');
    return { saccos };
  }

  /**
   * @description Deletes a Sacco
   * @param {string} id - The ID of the Sacco to delete
   * @returns {Promise<void>}
   */
  async deleteSacco(id) {
    console.log(`Deleting Sacco ${id}`);
    // TODO: Find Sacco by ID and remove it
  }
}

module.exports = new SaccoService();
