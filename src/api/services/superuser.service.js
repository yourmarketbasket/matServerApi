const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');

/**
 * @class SuperuserService
 * @description Handles superuser-specific business logic
 */
class SuperuserService {
  /**
   * @description Authenticates a superuser
   * @param {string} email - The superuser's email
   * @param {string} password - The superuser's password
   * @returns {Promise<{user: object, token: string}>}
   */
  async login(email, password) {
    // 1. Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Check if user is a superuser
    if (user.role !== 'superuser') {
      throw new Error('Not authorized');
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // Don't return password
    user.password = undefined;

    return { user, token };
  }

  /**
   * @description Creates a new support staff member
   * @param {object} staffData - The data for the new staff member
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createSupportStaff(staffData, io) {
    const staff = await User.create({ ...staffData, role: 'support_staff' });
    io.emit('staffCreated', { staff });
    return { user: staff };
  }

  /**
   * @description Updates a support staff member's details
   * @param {string} id - The ID of the staff member to update
   * @param {object} staffData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateSupportStaff(id, staffData, io) {
    const staff = await User.findByIdAndUpdate(id, staffData, { new: true });
    io.emit('staffUpdated', { staff });
    return { user: staff };
  }

  /**
   * @description Deletes a support staff member
   * @param {string} id - The ID of the staff member to delete
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<void>}
   */
  async deleteSupportStaff(id, io) {
    await User.findByIdAndDelete(id);
    io.emit('staffDeleted', { staffId: id });
  }

  /**
   * @description Retrieves system-wide metrics
   * @returns {Promise<object>}
   */
  async getSystemMetrics() {
    // This is a read operation, so no event is emitted.
    return { metrics: { totalUsers: 1000, totalRevenue: 500000, activeSaccos: 10 } };
  }

  /**
   * @description Sets a new system-wide fare policy
   * @param {object} policyData - The fare policy data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async setFarePolicy(policyData, io) {
    // In a real app, this would be saved to a 'Policy' collection.
    io.emit('farePolicyUpdated', { policy: policyData });
    return { policy: policyData };
  }

  /**
   * @description Sets the system fee policy
   * @param {object} policyData - The system fee data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async setSystemFeePolicy(policyData, io) {
    io.emit('systemFeePolicyUpdated', { policy: policyData });
    return { policy: policyData };
  }

  /**
   * @description Sets the loyalty program policy
   * @param {object} policyData - The loyalty policy data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async setLoyaltyPolicy(policyData, io) {
    io.emit('loyaltyPolicyUpdated', { policy: policyData });
    return { policy: policyData };
  }
}

module.exports = new SuperuserService();
