const OwnerService = require('../services/owner.service');

/**
 * @class OwnerController
 * @description Controller for owner-related operations
 */
class OwnerController {
  async updateOwnerStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await OwnerService.updateOwnerStatus(id, status, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OwnerController();
