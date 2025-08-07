const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt.util');
const { generateMfaSecret, verifyMfaToken } = require('../utils/mfa.util');
const { generateOTP } = require('../utils/otp.util');
const NotificationService = require('./notification.service');
const { getPermissionsForRole } = require('../../config/permissions');
const config = require('../../config');

/**
 * @class AuthService
 * @description Handles authentication logic
 */
class AuthService {
  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * @description Authenticates a user
   * @param {string} emailOrPhone - The user's email or phone
   * @param {string} password - The user's password
   * @param {string} [mfaCode] - The MFA code if required
   * @returns {Promise<{user: object, token: string}>}
   */
  async login(emailOrPhone, password, mfaCode) {
    // 1. Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password');

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Check if user is approved
    if (user.approvedStatus !== 'approved') {
      throw new Error(`Your account is currently ${user.approvedStatus}. Please contact support.`);
    }

    // 3. Check if the user is a superuser
    if (user.role === 'superuser') {
      throw new Error('Superuser login is not allowed here.');
    }

    // 4. Check if password matches
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

    // Get permissions for the role
    const permissions = await getPermissionsForRole(role);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      permissions,
    });

    // Don't return the password
    user.password = undefined;

    // Emit a real-time event
    io.emit('userRegistered', { user });

    return { user };
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
    await user.save({ validateBeforeSave: false }); // Bypass validation as we are only adding the secret

    return { qrCodeDataUrl };
  }

  /**
   * @description Verifies an MFA code and enables MFA for the user
   * @param {string} userId - The user's ID
   * @param {string} token - The MFA code from the user
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<boolean>}
   */
  async verifyMFA(userId, token, io) {
    const user = await User.findById(userId);
    if (!user || !user.mfaSecret) {
      throw new Error('MFA not set up or user not found.');
    }

    const isVerified = verifyMfaToken(user.mfaSecret, token);

    if (!isVerified) {
      throw new Error('Invalid MFA token.');
    }

    // The mfa is now considered fully enabled and verified.
    // We can add a flag to the user model if we want to enforce it from now on.
    // For now, just emitting an event is sufficient.
    io.to(userId).emit('mfaEnabled', { userId });

    return { success: true };
  }

  /**
   * @description Generates and sends an OTP to the user's email
   * @param {string} email - The user's email
   * @returns {Promise<{success: boolean}>}
   */
  async generateAndSendOtp(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists
      console.log(`OTP requested for non-existent user: ${email}`);
      return { success: true };
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to DB
    await OTP.create({ email, otp });

    // Send email
    try {
      await this.notificationService.sendEmail({
        to: email,
        subject: 'Your Safary Verification Code',
        context: {
          title: 'Verification Code',
          body: 'Please use the following code to verify your account. The code is valid for 10 minutes.',
          otp: otp,
        }
      });
    } catch (error) {
      console.error(`Failed to send OTP to ${email}`, error);
      // Even if email fails, we don't want to inform the user, as it could be part of an attack
    }

    return { success: true };
  }

  /**
   * @description Verifies an OTP
   * @param {string} email - The user's email
   * @param {string} otp - The OTP from the user
   * @returns {Promise<boolean>}
   */
  async verifyOtp(email, otp) {
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return false; // No OTP record found
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (isMatch) {
      // OTP is correct, delete it
      await OTP.findByIdAndDelete(otpRecord._id);
      return true;
    }

    return false; // OTP does not match
  }

  /**
   * @description Verifies a user's OTP after signup and sets their approval status.
   * @param {string} email - The user's email
   * @param {string} otp - The OTP from the user
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async verifySignup(email, otp) {
    const isOtpValid = await this.verifyOtp(email, otp);

    if (!isOtpValid) {
      throw new Error('Invalid or expired OTP.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      // This should not happen if OTP was valid, but as a safeguard:
      throw new Error('User not found.');
    }

    let message = '';
    let emailBody = '';

    if (user.role === 'passenger') {
      user.approvedStatus = 'approved';
      message = 'Your account has been successfully verified and approved!';
      emailBody = 'Congratulations! Your account is now active. You can log in and start using Safary.';
    } else {
      // For other roles, status remains 'pending' by default
      message = 'Your account has been verified. It is now pending review by an administrator.';
      emailBody = 'Your account has been successfully verified and is now pending review. We will notify you once it has been approved.';
    }

    await user.save();

    // Send welcome/status notification
    await this.notificationService.sendEmail({
      to: user.email,
      subject: 'Welcome to Safary!',
      context: {
        title: 'Welcome!',
        body: emailBody,
      }
    });

    return { success: true, message };
  }
}

module.exports = new AuthService();
