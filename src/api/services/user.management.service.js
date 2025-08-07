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
}

module.exports = new UserManagementService();
