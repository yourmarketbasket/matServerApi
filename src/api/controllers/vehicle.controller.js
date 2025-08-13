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

  async createVehicleForOwner(req, res, next) {
    try {
      const ownerId = req.user._id;
      const result = await VehicleService.createVehicleForOwner(req.body, ownerId, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getVehiclesByOwner(req, res, next) {
    try {
      const ownerId = req.user._id;
      const result = await VehicleService.getVehiclesByOwner(ownerId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleAsOwner(req, res, next) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;
      const result = await VehicleService.updateVehicleAsOwner(id, ownerId, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicleAsOwner(req, res, next) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;
      await VehicleService.deleteVehicleAsOwner(id, ownerId);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicleStatusAsOwner(req, res, next) {
    try {
      const { id } = req.params;
      const ownerId = req.user._id;
      const { status } = req.body;
      const result = await VehicleService.updateVehicleStatusAsOwner(id, ownerId, status, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VehicleController();
