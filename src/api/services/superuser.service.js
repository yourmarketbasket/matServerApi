const Superuser = require('../models/superuser.model');
const Staff = require('../models/staff.model');
const Permission = require('../models/permission.model');
const { generateToken } = require('../utils/jwt.util');
const { verifyMfaToken } = require('../utils/mfa.util');
const config = require('../../config');
const { permissionsData, getPermissionsForRole } = require('../../config/permissions');

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
    const superuserExists = await Superuser.findOne({ email: userData.email });
    if (superuserExists) {
      throw new Error('A superuser with that email already exists.');
    }

    const { name, email, phone, password } = userData;

    // 3. Get all permissions for the superuser
    const allPermissions = await getPermissionsForRole('Superuser');

    // 4. Create a new user instance
    const superuser = new Superuser({
      name,
      email,
      phone,
      password,
      permissions: allPermissions,
    });

    // 5. Save the new superuser
    await superuser.save();

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
    const superuser = await Superuser.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password');

    if (!superuser) {
      throw new Error('Invalid credentials or not a superuser.');
    }

    // 2. Check if password matches
    const isMatch = await superuser.matchPassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Generate JWT
    const token = generateToken(superuser, 'superuser');

    // Prepare superuser object for response (omitting sensitive fields)
    const superuserResponse = superuser.toObject();
    delete superuserResponse.password;
    delete superuserResponse.mfaSecret;

    return { user: superuserResponse, token };
  }

  /**
   * @description Creates a new support staff member
   * @param {object} staffData - The data for the new staff member
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createSupportStaff(staffData, io) {
    const staff = await Staff.create({ ...staffData, role: 'support_staff' });
    io.emit('staffCreated', { staff });
    return { staff: staff };
  }

  /**
   * @description Updates a support staff member's details
   * @param {string} id - The ID of the staff member to update
   * @param {object} staffData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateSupportStaff(id, staffData, io) {
    const staff = await Staff.findByIdAndUpdate(id, staffData, { new: true });
    io.emit('staffUpdated', { staff });
    return { staff: staff };
  }

  /**
   * @description Deletes a support staff member
   * @param {string} id - The ID of the staff member to delete
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<void>}
   */
  async deleteSupportStaff(id, io) {
    await Staff.findByIdAndDelete(id);
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

  // Permission management
  async syncPermissions() {
    await Permission.deleteMany({});
    await Permission.insertMany(permissionsData.permissions);
  }

  async getPermissions() {
    return await Permission.find({});
  }

  async createPermission(permissionData) {
    const newPermission = await Permission.create(permissionData);

    // After creating the permission, update all users who have the relevant roles.
    if (newPermission && newPermission.roles && newPermission.roles.length > 0) {
      const rolesToUpdate = newPermission.roles.map(role => role.toLowerCase());
      const permissionNumber = newPermission.permissionNumber;

      // Update all staff whose role is in the rolesToUpdate array
      await Staff.updateMany(
        { role: { $in: rolesToUpdate } },
        { $addToSet: { permissions: permissionNumber } }
      );
    }

    return newPermission;
  }

  async updatePermission(id, permissionData) {
    return await Permission.findByIdAndUpdate(id, permissionData, { new: true });
  }

  async deletePermission(id) {
    return await Permission.findByIdAndDelete(id);
  }
}

module.exports = new SuperuserService();
