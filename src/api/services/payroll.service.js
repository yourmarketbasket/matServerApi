const Payroll = require('../models/payroll.model');
const Trip = require('../models/trip.model');
const Payment = require('../models/payment.model');

/**
 * @class PayrollService
 * @description Manages the logic for processing payrolls
 */
class PayrollService {
  /**
   * @description Processes payroll for a completed trip
   * @param {string} tripId - The ID of the trip
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async processPayroll(tripId, io) {
    // This is a simplified placeholder. A real implementation would be complex.
    const payrollData = { tripId, totalRevenue: 10000, systemFee: 100, saccoFee: 900, driverCut: 4000, ownerCut: 5000, status: 'completed' };
    const payroll = await Payroll.create(payrollData);

    // Notify relevant parties
    io.to(payroll.ownerId.toString()).emit('payrollProcessed', { payroll });
    io.to(payroll.driverId.toString()).emit('payrollProcessed', { payroll });
    io.to(payroll.saccoId.toString()).emit('payrollProcessed', { payroll });

    return { payroll };
  }

  /**
   * @description Retrieves all payrolls for a specific owner
   * @param {string} ownerId - The ID of the owner
   * @returns {Promise<Array<object>>}
   */
  async getPayrollByOwner(ownerId) {
    const payrolls = await Payroll.find({ ownerId });
    return { payrolls };
  }

  /**
   * @description Retrieves all payrolls for a specific driver
   * @param {string} driverId - The ID of the driver
   * @returns {Promise<Array<object>>}
   */
  async getPayrollByDriver(driverId) {
    const payrolls = await Payroll.find({ driverId });
    return { payrolls };
  }

  /**
   * @description Resolves a disputed payroll record
   * @param {string} id - The ID of the payroll to resolve
   * @param {string} resolution - Details of the resolution
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async resolvePayrollDispute(id, resolution, io) {
    const payroll = await Payroll.findByIdAndUpdate(id, { status: 'completed', resolutionDetails: resolution }, { new: true });

    // Notify relevant parties
    io.to(payroll.ownerId.toString()).emit('payrollDisputeResolved', { payroll });
    io.to(payroll.driverId.toString()).emit('payrollDisputeResolved', { payroll });
    io.to(payroll.saccoId.toString()).emit('payrollDisputeResolved', { payroll });

    return { payroll };
  }
}

module.exports = new PayrollService();
