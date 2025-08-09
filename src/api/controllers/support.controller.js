const SupportService = require('../services/support.service');

/**
 * @class SupportController
 * @description Controller for support tickets
 */
class SupportController {
  async createTicket(req, res, next) {
    try {
      req.body.raisedBy = req.user._id;
      const ticket = await SupportService.createTicket(req.body, req.io);
      res.status(201).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  async getTickets(req, res, next) {
    try {
      const tickets = await SupportService.getTickets(req.user);
      res.status(200).json({ success: true, data: tickets });
    } catch (error) {
      next(error);
    }
  }

  async getTicketById(req, res, next) {
    try {
      const { id } = req.params;
      const ticket = await SupportService.getTicketById(id);
      res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  async updateTicket(req, res, next) {
    try {
      const { id } = req.params;
      const ticket = await SupportService.updateTicket(id, req.body);
      res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }

  async deleteTicket(req, res, next) {
    try {
      const { id } = req.params;
      await SupportService.deleteTicket(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }

  async escalateTicket(req, res, next) {
    try {
      const { id } = req.params;
      const ticket = await SupportService.escalateTicket(id, req.io);
      res.status(200).json({ success: true, data: ticket });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupportController();
