const SupportGroupService = require('../services/supportGroup.service');

/**
 * @class SupportGroupController
 * @description Controller for support group management operations
 */
class SupportGroupController {
  async createSupportGroup(req, res, next) {
    try {
      const group = await SupportGroupService.createSupportGroup(req.body);
      res.status(201).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async getSupportGroups(req, res, next) {
    try {
      const groups = await SupportGroupService.getSupportGroups();
      res.status(200).json({ success: true, data: groups });
    } catch (error) {
      next(error);
    }
  }

  async getSupportGroupById(req, res, next) {
    try {
      const { id } = req.params;
      const group = await SupportGroupService.getSupportGroupById(id);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async updateSupportGroup(req, res, next) {
    try {
      const { id } = req.params;
      const group = await SupportGroupService.updateSupportGroup(id, req.body);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async deleteSupportGroup(req, res, next) {
    try {
      const { id } = req.params;
      await SupportGroupService.deleteSupportGroup(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }

  async addMemberToSupportGroup(req, res, next) {
    try {
      const { id, userId } = req.params;
      const group = await SupportGroupService.addMemberToSupportGroup(id, userId);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  async removeMemberFromSupportGroup(req, res, next) {
    try {
      const { id, userId } = req.params;
      const group = await SupportGroupService.removeMemberFromSupportGroup(id, userId);
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SupportGroupController();
