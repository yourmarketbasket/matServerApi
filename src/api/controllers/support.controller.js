const SupportService = require('../services/support.service');

/**
 * @class SupportController
 * @description Controller for support inquiries and escalations
 */
class SupportController {
  async createInquiry(req, res, next) {
    try {
      req.body.raisedBy = req.user._id;
      const result = await SupportService.createInquiry(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getInquiries(req, res, next) {
    try {
      const result = await SupportService.getInquiries();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateInquiry(req, res, next) {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      const result = await SupportService.resolveInquiry(id, resolution, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createEscalation(req, res, next) {
    try {
      const { inquiryId, details } = req.body;
      const result = await SupportService.escalateInquiry(inquiryId, details, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupportController();
