const UserManagementService = require('../services/user.management.service');

/**
 * @class UserManagementController
 * @description Controller for user management operations
 */
class UserManagementController {
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
}

module.exports = new UserManagementController();
