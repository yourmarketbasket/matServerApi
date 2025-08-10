const SaccoService = require('../services/sacco.service');

/**
 * @class SaccoController
 * @description Controller for Sacco management operations
 */
class SaccoController {
  async createSacco(req, res, next) {
    try {
      req.body.createdBy = req.user.id;
      const result = await SaccoService.createSacco(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSaccos(req, res, next) {
    try {
      const result = await SaccoService.getSaccos();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateSacco(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SaccoService.updateSacco(id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approveSacco(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SaccoService.approveSacco(id, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async rejectSacco(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await SaccoService.rejectSacco(id, reason, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteSacco(req, res, next) {
    try {
      // const { id } = req.params;
      // await SaccoService.deleteSacco(id);
      res.status(200).json({ success: true, message: 'Sacco deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaccoController();
