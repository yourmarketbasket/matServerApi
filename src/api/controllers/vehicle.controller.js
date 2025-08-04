const VehicleService = require('../services/vehicle.service');

/**
 * @class VehicleController
 * @description Controller for vehicle management
 */
class VehicleController {
  async getVehicles(req, res, next) {
    try {
      const { saccoId } = req.params;
      const result = await VehicleService.getVehiclesBySacco(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createVehicle(req, res, next) {
    try {
      const result = await VehicleService.createVehicle(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req, res, next) {
    try {
      const { id } = req.params;
      const result = await VehicleService.updateVehicle(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req, res, next) {
    try {
      const { id } = req.params;
      await VehicleService.deleteVehicle(id);
      // Optionally, emit a 'vehicleDeleted' event
      req.io.emit('vehicleDeleted', { vehicleId: id });
      res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VehicleController();
