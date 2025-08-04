const Driver = require('../models/driver.model');

/**
 * @class DriverService
 * @description Manages business logic for drivers
 */
class DriverService {
  /**
   * @description Creates a new driver profile
   * @param {object} driverData - The data for the new driver
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createDriver(driverData, io) {
    const driver = await Driver.create(driverData);
    io.emit('driverCreated', { driver });
    return { driver };
  }

  /**
   * @description Assigns a driver to a specific vehicle
   * @param {string} driverId - The ID of the driver
   * @param {string} vehicleId - The ID of the vehicle
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async assignDriverToVehicle(driverId, vehicleId, io) {
    const driver = await Driver.findByIdAndUpdate(driverId, { vehicleId }, { new: true });
    io.emit('driverUpdated', { driver });
    return { driver };
  }

  /**
   * @description Retrieves all drivers for a given Sacco
   * @param {string} saccoId - The ID of the Sacco
   * @returns {Promise<Array<object>>}
   */
  async getDriversBySacco(saccoId) {
    const drivers = await Driver.find({ saccoId });
    return { drivers };
  }

  /**
   * @description Updates a driver's details
   * @param {string} id - The ID of the driver to update
   * @param {object} driverData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateDriver(id, driverData, io) {
    const driver = await Driver.findByIdAndUpdate(id, driverData, { new: true });
    io.emit('driverUpdated', { driver });
    return { driver };
  }

  /**
   * @description Retrieves performance metrics for a specific driver
   * @param {string} id - The ID of the driver
   * @returns {Promise<object>}
   */
  async getDriverPerformance(id) {
    console.log(`Fetching performance for driver ${id}`);
    // TODO: Find driver by ID and return their performanceMetrics
    return { performance: { averageRating: 4.8, completedTrips: 150 } };
  }
}

module.exports = new DriverService();
