const Permission = require('../models/permission.model');

/**
 * @class PermissionService
 * @description Handles the business logic for permissions.
 */
class PermissionService {
  /**
   * @description Creates a new permission
   * @param {object} permissionData - The data for the new permission
   * @returns {Promise<object>} The new permission object
   */
  async createPermission(permissionData) {
    const permission = await Permission.create(permissionData);
    return permission;
  }

  /**
   * @description Get all permissions
   * @returns {Promise<object[]>} A list of all permissions
   */
  async getPermissions() {
    const permissions = await Permission.find();
    return permissions;
  }

  /**
   * @description Get a single permission by its ID
   * @param {string} permissionId - The ID of the permission to retrieve
   * @returns {Promise<object>} The permission object
   */
  async getPermissionById(permissionId) {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      throw new Error('Permission not found.');
    }
    return permission;
  }

  /**
   * @description Updates a permission
   * @param {string} permissionId - The ID of the permission to update
   * @param {object} permissionData - The new data for the permission
   * @returns {Promise<object>} The updated permission object
   */
  async updatePermission(permissionId, permissionData) {
    const permission = await Permission.findByIdAndUpdate(
      permissionId,
      permissionData,
      { new: true, runValidators: true }
    );

    if (!permission) {
      throw new Error('Permission not found.');
    }

    return permission;
  }

  /**
   * @description Deletes a permission
   * @param {string} permissionId - The ID of the permission to delete
   * @returns {Promise<object>} A confirmation message
   */
  async deletePermission(permissionId) {
    const permission = await Permission.findByIdAndDelete(permissionId);

    if (!permission) {
      throw new Error('Permission not found.');
    }

    return { success: true, message: 'Permission deleted successfully.' };
  }
}

module.exports = new PermissionService();
