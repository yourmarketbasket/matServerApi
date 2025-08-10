const TicketService = require('../services/ticket.service');

/**
 * @class PassengerController
 * @description Controller for passenger-specific actions
 */
class PassengerController {
  async createTicket(req, res, next) {
    try {
      // The authenticated user from the 'protect' middleware is the passenger
      req.body.passengerId = req.user._id;
      const result = await TicketService.registerTicket(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PassengerController();
