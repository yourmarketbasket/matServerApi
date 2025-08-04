const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');
const { generateMfaSecret, verifyMfaToken } = require('../utils/mfa.util');
const config = require('../../config');

/**
 * @class AuthService
 * @description Handles authentication logic
 */
class AuthService {
  /**
   * @description Authenticates a user
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @param {string} [mfaCode] - The MFA code if required
   * @returns {Promise<{user: object, token: string}>}
   */
  async login(email, password, mfaCode) {
    // 1. Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Check MFA if enabled
    if (user.mfaSecret) {
      if (!mfaCode) {
        // This is a special return case to signal the frontend to prompt for MFA
        return { mfaRequired: true, userId: user._id };
      }
      const isMfaValid = verifyMfaToken(user.mfaSecret, mfaCode);
      if (!isMfaValid) {
        throw new Error('Invalid MFA code');
      }
    }

    // 4. Generate JWT
    const token = generateToken(user._id);

    // Don't return password or mfaSecret
    user.password = undefined;
    user.mfaSecret = undefined;

    return { user, token };
  }

  /**
   * @description Registers a new user
   * @param {object} userData - The user's data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<{user: object}>}
   */
  async signup(userData, io) {
    const { name, email, phone, password, role } = userData;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User with that email already exists.');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
    });

    // Don't return the password
    user.password = undefined;

    // Emit a real-time event
    io.emit('userRegistered', { user });

    return { user };
  }

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

    // Don't return the password
    superuser.password = undefined;

    // Emit a real-time event
    io.emit('userRegistered', { user: superuser });

    return { user: superuser };
  }

  /**
   * @description Generates a password reset token
   * @param {string} email - The user's email
   * @returns {Promise<void>}
   */
  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      // We don't want to reveal if a user exists or not
      return;
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Here you would typically send an email with the resetToken.
    // For this example, we'll just log it.
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  /**
   * @description Resets a user's password using a token
   * @param {string} token - The reset token from the user
   * @param {string} newPassword - The new password
   * @returns {Promise<{success: boolean}>}
   */
  async resetPassword(token, newPassword) {
    // Hash the token to match what's in the database
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      passwordResetExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    // Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    return { success: true };
  }

  /**
   * @description Sets up MFA for a user
   * @param {string} userId - The user's ID
   * @returns {Promise<{mfaSecret: string, qrCode: string}>}
   */
  async setupMFA(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { secret, qrCodeDataUrl } = await generateMfaSecret(user.email);

    user.mfaSecret = secret;
    await user.save();

    return { qrCodeDataUrl };
  }

  /**
   * @description Verifies an MFA code and enables MFA for the user
   * @param {string} userId - The user's ID
   * @param {string} token - The MFA code from the user
   * @returns {Promise<boolean>}
   */
  async verifyMFA(userId, token) {
    const user = await User.findById(userId);
    if (!user || !user.mfaSecret) {
      throw new Error('MFA not set up or user not found.');
    }

    const isVerified = verifyMfaToken(user.mfaSecret, token);

    if (!isVerified) {
      throw new Error('Invalid MFA token.');
    }

    // The mfa is now considered fully enabled and verified
    return { success: true };
  }
}

module.exports = new AuthService();
