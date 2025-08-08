const PermissionService = require('../services/permission.service');

/**
 * @class PermissionController
 * @description Controller for permission operations
 */
class PermissionController {
  async createPermissions(req, res, next) {
    try {
      const permissions = await PermissionService.createPermissions(req.body);
      res.status(201).json({ success: true, data: permissions });
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

  async getPermissionByNumber(req, res, next) {
    try {
      const { permissionNumber } = req.params;
      const permission = await PermissionService.getPermissionByNumber(permissionNumber);
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  }

  async updatePermissionByNumber(req, res, next) {
    try {
      const { permissionNumber } = req.params;
      const permission = await PermissionService.updatePermissionByNumber(permissionNumber, req.body);
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  }

  async deletePermissionByNumber(req, res, next) {
    try {
      const { permissionNumber } = req.params;
      await PermissionService.deletePermissionByNumber(permissionNumber);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PermissionController();
