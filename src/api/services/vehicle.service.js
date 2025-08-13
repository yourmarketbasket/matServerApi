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

  /**
   * @description Creates a new vehicle for a specific owner
   * @param {object} vehicleData - The data for the new vehicle
   * @param {string} ownerId - The ID of the owner
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createVehicleForOwner(vehicleData, ownerId, io) {
    vehicleData.ownerId = ownerId;
    const vehicle = await Vehicle.create(vehicleData);
    io.emit('vehicleCreated', { vehicle });
    return { vehicle };
  }

  /**
   * @description Retrieves all vehicles for a given Owner
   * @param {string} ownerId - The ID of the Owner
   * @returns {Promise<Array<object>>}
   */
  async getVehiclesByOwner(ownerId) {
    const vehicles = await Vehicle.find({ ownerId });
    return { vehicles };
  }

  /**
   * @description Updates a vehicle's details by its owner
   * @param {string} vehicleId - The ID of the vehicle to update
   * @param {string} ownerId - The ID of the owner performing the update
   * @param {object} vehicleData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateVehicleAsOwner(vehicleId, ownerId, vehicleData, io) {
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Not authorized to update this vehicle');
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, vehicleData, { new: true });
    io.emit('vehicleUpdated', { vehicle: updatedVehicle });
    return { vehicle: updatedVehicle };
  }

  /**
   * @description Deletes a vehicle by its owner
   * @param {string} vehicleId - The ID of the vehicle to delete
   * @param {string} ownerId - The ID of the owner performing the deletion
   * @returns {Promise<void>}
   */
  async deleteVehicleAsOwner(vehicleId, ownerId) {
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Not authorized to delete this vehicle');
    }

    await Vehicle.findByIdAndDelete(vehicleId);
  }

  /**
   * @description Updates a vehicle's status by its owner
   * @param {string} vehicleId - The ID of the vehicle to update
   * @param {string} ownerId - The ID of the owner performing the update
   * @param {string} status - The new status
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateVehicleStatusAsOwner(vehicleId, ownerId, status, io) {
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.ownerId.toString() !== ownerId.toString()) {
      throw new Error('Not authorized to update this vehicle');
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, { status }, { new: true });
    io.emit('vehicleUpdated', { vehicle: updatedVehicle }); // Maybe a more specific event? 'vehicleStatusChanged'
    return { vehicle: updatedVehicle };
  }
}

module.exports = new VehicleService();
