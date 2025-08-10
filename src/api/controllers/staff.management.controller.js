const StaffManagementService = require('../services/staff.management.service');

/**
 * @class StaffManagementController
 * @description Controller for staff management operations
 */
class StaffManagementController {
  async getStaff(req, res, next) {
    try {
      const staff = await StaffManagementService.getStaff();
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async getStaffById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new Error('Staff ID is missing from the request URL.'));
      }
      const staff = await StaffManagementService.getStaffById(id);
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async updateStaffStatus(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new Error('Staff ID is missing from the request URL.'));
      }
      const { status } = req.body;
      const staff = await StaffManagementService.updateStaffStatus(id, status);
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async updateStaffRank(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new Error('Staff ID is missing from the request URL.'));
      }
      const { rank } = req.body;
      const staff = await StaffManagementService.updateStaffRank(id, rank);
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async addStaffPermissions(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new Error('Staff ID is missing from the request URL.'));
      }
      const { permission, permissions } = req.body;
      if (!permission && !permissions) {
        return next(new Error('Request body must contain either "permission" (string) or "permissions" (array of strings).'));
      }
      const permsToAdd = permissions || permission;
      const staff = await StaffManagementService.addStaffPermissions(id, permsToAdd);
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async removeStaffPermission(req, res, next) {
    try {
      const { id, permission } = req.params;
      if (!id || !permission) {
        return next(new Error('Staff ID or permission is missing from the request URL.'));
      }
      const staff = await StaffManagementService.removeStaffPermission(id, permission);
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async getAdminStaff(req, res, next) {
    try {
      const staff = await StaffManagementService.getAdminStaff();
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  }

  async remoteLogout(req, res, next) {
    try {
      const { staffId } = req.body;
      if (!staffId) {
        return next(new Error('Staff ID is required in the request body.'));
      }
      const result = await StaffManagementService.remoteLogout(staffId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StaffManagementController();
