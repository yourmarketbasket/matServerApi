const User = require('../models/user.model');

/**
 * @class UserManagementService
 * @description Handles user management logic for admins/superusers
 */
class UserManagementService {
  /**
   * @description Updates a user's approval status
   * @param {string} userId - The ID of the user to update
   * @param {string} status - The new status
   * @returns {Promise<object>} The updated user object
   */
  async updateUserStatus(userId, status) {
    // Validate status
    const validStatuses = ['pending', 'approved', 'suspended', 'blocked'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status provided.');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { approvedStatus: status },
      { new: true }
    );

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }

  /**
   * @description Get all users
   * @returns {Promise<object[]>} A list of all users
   */
  async getUsers() {
    const users = await User.find();
    return users;
  }

  /**
   * @description Get a single user by their ID
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Promise<object>} The user object
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  }

  /**
   * @description Updates a user's rank
   * @param {string} userId - The ID of the user to update
   * @param {string} rank - The new rank
   * @returns {Promise<object>} The updated user object
   */
  async updateUserRank(userId, rank) {
    const user = await User.findByIdAndUpdate(
      userId,
      { rank },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }

  /**
   * @description Adds a permission or a list of permissions to a user.
   * @param {string} userId - The ID of the user to update.
   * @param {string|string[]} permissions - The permission or permissions to add.
   * @returns {Promise<object>} The updated user object.
   */
  async addUserPermission(userId, permissions) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const permissionsToAdd = Array.isArray(permissions) ? permissions : [permissions];
    const newPermissions = [];

    for (const p of permissionsToAdd) {
      // Avoid adding duplicates that are already on the user or in the current request
      if (!user.permissions.includes(p) && !newPermissions.includes(p)) {
        newPermissions.push(p);
      }
    }

    // If all provided permissions already exist on the user, no need to save.
    if (newPermissions.length === 0) {
      return user;
    }

    user.permissions.push(...newPermissions);
    await user.save();
    return user;
  }

  /**
   * @description Removes a permission from a user
   * @param {string} userId - The ID of the user to update
   * @param {string} permission - The permission to remove
   * @returns {Promise<object>} The updated user object
   */
  async removeUserPermission(userId, permission) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    const permissionIndex = user.permissions.indexOf(permission);
    if (permissionIndex === -1) {
      throw new Error('User does not have this permission.');
    }

    user.permissions.splice(permissionIndex, 1);
    await user.save();
    return user;
  }
}

module.exports = new UserManagementService();
