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
}

module.exports = new VehicleController();
