const DriverService = require('../services/driver.service');
const TripService = require('../services/trip.service');

/**
 * @class DriverController
 * @description Controller for driver management
 */
class DriverController {
  async createDriver(req, res, next) {
    try {
      const result = await DriverService.createDriver(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getDrivers(req, res, next) {
    try {
      const { saccoId } = req.params;
      const result = await DriverService.getDriversBySacco(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateDriver(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DriverService.updateDriver(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPerformance(req, res, next) {
    try {
      const { id } = req.params;
      const result = await DriverService.getDriverPerformance(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // Trip management methods moved here
  async createTrip(req, res, next) {
    try {
      // Add the authenticated driver's ID to the trip data
      req.body.driverId = req.user._id;
      const result = await TripService.registerTrip(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async cancelTrip(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      // In a real app, we would also verify that req.user._id is the driver of this trip
      await TripService.cancelTrip(id, reason, req.io);
      res.status(200).json({ success: true, message: 'Trip canceled successfully' });
    } catch (error) {
      next(error);
    }
  }

  async completeTrip(req, res, next) {
    try {
      const { id } = req.params;
      // In a real app, we would also verify that req.user._id is the driver of this trip
      const result = await TripService.completeTrip(id, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverController();
