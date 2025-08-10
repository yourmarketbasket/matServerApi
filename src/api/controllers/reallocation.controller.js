const ReallocationService = require('../services/reallocation.service');

/**
 * @class ReallocationController
 * @description Controller for ticket reallocation operations
 */
class ReallocationController {
  async autoReallocate(req, res, next) {
    try {
      const { tripId } = req.params;
      const { reason } = req.body;
      const result = await ReallocationService.autoReallocateTickets(tripId, reason, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async manualReallocate(req, res, next) {
    try {
      const { ticketId, newTripId } = req.body;
      const result = await ReallocationService.manualReallocateTicket(ticketId, newTripId, req.staff._id, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReallocationController();
