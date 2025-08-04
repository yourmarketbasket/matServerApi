const TripService = require('../services/trip.service');

/**
 * @class TripController
 * @description Controller for trip management
 */
class TripController {
  async getTrips(req, res, next) {
    try {
      const { routeId } = req.params;
      const result = await TripService.getTripsByRoute(routeId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createTrip(req, res, next) {
    try {
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
      await TripService.cancelTrip(id, reason, req.io);
      res.status(200).json({ success: true, message: 'Trip canceled successfully' });
    } catch (error) {
      next(error);
    }
  }

  async completeTrip(req, res, next) {
    try {
      const { id } = req.params;
      const result = await TripService.completeTrip(id, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TripController();
