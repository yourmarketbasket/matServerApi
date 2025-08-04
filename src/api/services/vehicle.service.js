const Vehicle = require('../models/vehicle.model');

/**
 * @class VehicleService
 * @description Handles business logic related to vehicles
 */
class VehicleService {
  /**
   * @description Retrieves all vehicles for a given Sacco
   * @param {string} saccoId - The ID of the Sacco
   * @returns {Promise<Array<object>>}
   */
  async getVehiclesBySacco(saccoId) {
    const vehicles = await Vehicle.find({ saccoId });
    return { vehicles };
  }

  /**
   * @description Creates a new vehicle
   * @param {object} vehicleData - The data for the new vehicle
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createVehicle(vehicleData, io) {
    const vehicle = await Vehicle.create(vehicleData);
    io.emit('vehicleCreated', { vehicle });
    return { vehicle };
  }

  /**
   * @description Updates a vehicle's details
   * @param {string} id - The ID of the vehicle to update
   * @param {object} vehicleData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateVehicle(id, vehicleData, io) {
    const vehicle = await Vehicle.findByIdAndUpdate(id, vehicleData, { new: true });
    io.emit('vehicleUpdated', { vehicle });
    return { vehicle };
  }

  /**
   * @description Deletes a vehicle
   * @param {string} id - The ID of the vehicle to delete
   * @returns {Promise<void>}
   */
  async deleteVehicle(id) {
    await Vehicle.findByIdAndDelete(id);
  }
}

module.exports = new VehicleService();
