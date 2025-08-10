const TicketService = require('../services/ticket.service');

/**
 * @class TicketController
 * @description Controller for ticket management
 */
class TicketController {
  async getTickets(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await TicketService.getUserTickets(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await TicketService.updateTicketStatus(id, status, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async scanTicket(req, res, next) {
    try {
      const { qrCode } = req.params;
      const result = await TicketService.scanTicket(qrCode);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async reallocateTicket(req, res, next) {
    try {
      const { id } = req.params;
      const { newTripId } = req.body;
      const result = await TicketService.reallocateTicket(id, newTripId, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TicketController();
