const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');
const { verifyMfaToken } = require('../utils/mfa.util');
const config = require('../../config');

/**
 * @class SuperuserService
 * @description Handles superuser-specific business logic
 */
class SuperuserService {
  /**
   * @description Registers a new superuser
   * @param {object} userData - The superuser's data
   * @param {string} adminKey - The secret admin key
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<{user: object}>}
   */
  async registerSuperuser(userData, adminKey, io) {
    // 1. Validate the admin key
    if (adminKey !== config.adminKey) {
      throw new Error('Invalid admin key. Superuser registration failed.');
    }

    // 2. Check if a superuser already exists
    const superuserExists = await User.findOne({ role: 'superuser' });
    if (superuserExists) {
      throw new Error('A superuser already exists. Cannot register another.');
    }

    const { name, email, phone, password } = userData;

    // 3. Create the superuser
    const superuser = await User.create({
      name,
      email,
      phone,
      password,
      role: 'superuser',
    });
    // force

    // Don't return the password
    superuser.password = undefined;

    // Emit a real-time event
    io.emit('userRegistered', { user: superuser });

    return { user: superuser };
  }

  /**
   * @description Authenticates a superuser
   * @param {string} emailOrPhone - The user's email or phone
   * @param {string} password - The user's password
   * @param {string} [mfaCode] - The MFA code if required
   * @returns {Promise<{user: object, token: string}>}
   */
  async loginSuperuser(emailOrPhone, password, mfaCode) {
    // 1. Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      role: 'superuser',
    }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials or not a superuser.');
    }

    // 2. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Generate JWT
    const token = generateToken(user._id);

    // Don't return password or mfaSecret
    user.password = undefined;
    user.mfaSecret = undefined;

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
