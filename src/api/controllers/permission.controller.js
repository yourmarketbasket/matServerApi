const PermissionService = require('../services/permission.service');

/**
 * @class PermissionController
 * @description Controller for permission operations
 */
class PermissionController {
  async createPermission(req, res, next) {
    try {
      const permission = await PermissionService.createPermission(req.body);
      res.status(201).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(req, res, next) {
    try {
      const permissions = await PermissionService.getPermissions();
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      next(error);
    }
  }

  async getPermissionById(req, res, next) {
    try {
      const { id } = req.params;
      const permission = await PermissionService.getPermissionById(id);
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req, res, next) {
    try {
      const { id } = req.params;
      const permission = await PermissionService.updatePermission(id, req.body);
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  }

  async deletePermission(req, res, next) {
    try {
      const { id } = req.params;
      await PermissionService.deletePermission(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermissionController();
