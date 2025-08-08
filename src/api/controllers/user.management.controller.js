const UserManagementService = require('../services/user.management.service');

/**
 * @class UserManagementController
 * @description Controller for user management operations
 */
class UserManagementController {
  async getUsers(req, res, next) {
    try {
      const users = await UserManagementService.getUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserManagementService.getUserById(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await UserManagementService.updateUserStatus(id, status);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUserRank(req, res, next) {
    try {
      const { id } = req.params;
      const { rank } = req.body;
      const user = await UserManagementService.updateUserRank(id, rank);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async addUserPermission(req, res, next) {
    try {
      const { id } = req.params;
      const { permission, permissions } = req.body;

      if (!permission && !permissions) {
        return next(new Error('Request body must contain either "permission" (string) or "permissions" (array of strings).'));
      }

      const permsToAdd = permissions || permission;
      const user = await UserManagementService.addUserPermission(id, permsToAdd);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async removeUserPermission(req, res, next) {
    try {
      const { id, permission } = req.params;
      const user = await UserManagementService.removeUserPermission(
        id,
        permission
      );
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserManagementController();
