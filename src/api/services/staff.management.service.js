const Staff = require('../models/staff.model');

/**
 * @class StaffManagementService
 * @description Handles staff management logic.
 */
class StaffManagementService {
  /**
   * @description Get all staff members
   * @returns {Promise<object[]>} A list of all staff members
   */
  async getStaff() {
    const staff = await Staff.find();
    return staff;
  }

  /**
   * @description Get a single staff member by their ID
   * @param {string} staffId - The ID of the staff member to retrieve
   * @returns {Promise<object>} The staff member object
   */
  async getStaffById(staffId) {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error('Staff not found.');
    }
    return staff;
  }

  /**
   * @description Updates a staff member's approval status
   * @param {string} staffId - The ID of the staff member to update
   * @param {string} status - The new status
   * @returns {Promise<object>} The updated staff member object
   */
  async updateStaffStatus(staffId, status) {
    const validStatuses = ['pending', 'approved', 'suspended', 'blocked'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status provided.');
    }
    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { approvedStatus: status },
      { new: true, runValidators: true }
    );
    if (!staff) {
      throw new Error('Staff not found.');
    }
    return staff;
  }

  /**
   * @description Updates a staff member's rank
   * @param {string} staffId - The ID of the staff member to update
   * @param {string} rank - The new rank
   * @returns {Promise<object>} The updated staff member object
   */
  async updateStaffRank(staffId, rank) {
    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { rank },
      { new: true, runValidators: true }
    );
    if (!staff) {
      throw new Error('Staff not found.');
    }
    return staff;
  }

  /**
   * @description Adds one or more permissions to a staff member.
   * @param {string} staffId - The ID of the staff member to update.
   * @param {string|string[]} permissions - The permission or permissions to add.
   * @returns {Promise<object>} The updated staff member object.
   */
  async addStaffPermissions(staffId, permissions) {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error('Staff not found.');
    }

    const permissionsToAdd = Array.isArray(permissions) ? permissions : [permissions];
    const newPermissions = [];

    for (const p of permissionsToAdd) {
      if (!staff.permissions.includes(p) && !newPermissions.includes(p)) {
        newPermissions.push(p);
      }
    }

    if (newPermissions.length === 0) {
      return staff;
    }

    staff.permissions.push(...newPermissions);
    await staff.save();
    return staff;
  }

  /**
   * @description Removes a permission from a staff member
   * @param {string} staffId - The ID of the staff member to update
   * @param {string} permission - The permission to remove
   * @returns {Promise<object>} The updated staff member object
   */
  async removeStaffPermission(staffId, permission) {
    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { $pull: { permissions: permission } },
      { new: true }
    );
    if (!staff) {
      throw new Error('Staff not found.');
    }
    return staff;
  }

  /**
   * @description Get all admin staff members
   * @returns {Promise<object[]>} A list of all admin staff members
   */
  async getAdminStaff() {
    const adminRanks = [
      'CEO',
      'CFO',
      'COO',
      'CTO',
      'VP',
      'Director',
      'Manager',
      'Supervisor',
    ];
    const adminStaff = await Staff.find({ rank: { $in: adminRanks } });
    return adminStaff;
  }

  /**
   * @description Initiates a remote logout for a staff member by invalidating all their existing tokens.
   * @param {string} staffId - The ID of the staff member to log out.
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async remoteLogout(staffId) {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new Error('Staff not found.');
    }

    staff.tokenValidAfter = new Date();
    await staff.save();

    return { success: true, message: `Successfully initiated remote logout for staff member ${staff.name}.` };
  }
}

module.exports = new StaffManagementService();
