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
}

module.exports = new TripController();
