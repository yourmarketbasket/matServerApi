const Permission = require('../models/permission.model');

/**
 * @class PermissionService
 * @description Handles the business logic for permissions.
 */
class PermissionService {
  /**
   * @description Creates one or more new permissions.
   * @param {object|object[]} permissionData - The data for the new permission(s).
   * @returns {Promise<object|object[]>} The created permission(s).
   */
  async createPermissions(permissionData) {
    const permissions = await Permission.create(permissionData);
    return permissions;
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
   * @description Get a single permission by its permission number
   * @param {string} permissionNumber - The permission number to retrieve (e.g., "P001")
   * @returns {Promise<object>} The permission object
   */
  async getPermissionByNumber(permissionNumber) {
    const permission = await Permission.findOne({ permissionNumber: permissionNumber });
    if (!permission) {
      throw new Error('Permission not found.');
    }
    return permission;
  }

  /**
   * @description Updates a permission by its permission number
   * @param {string} permissionNumber - The permission number to update
   * @param {object} permissionData - The new data for the permission
   * @returns {Promise<object>} The updated permission object
   */
  async updatePermissionByNumber(permissionNumber, permissionData) {
    const permission = await Permission.findOneAndUpdate(
      { permissionNumber: permissionNumber },
      permissionData,
      { new: true, runValidators: true }
    );

    if (!permission) {
      throw new Error('Permission not found.');
    }

    return permission;
  }

  /**
   * @description Deletes a permission by its permission number
   * @param {string} permissionNumber - The permission number to delete
   * @returns {Promise<object>} A confirmation message
   */
  async deletePermissionByNumber(permissionNumber) {
    const permission = await Permission.findOneAndDelete({ permissionNumber: permissionNumber });

    if (!permission) {
      throw new Error('Permission not found.');
    }

    return { success: true, message: 'Permission deleted successfully.' };
  }
}

module.exports = new PermissionService();
