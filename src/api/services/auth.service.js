const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
   * @description Registers a new user after OTP verification.
   * @param {object} userData - The user's data, including a verifiedToken
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<{user: object}>}
   */
  async signup(userData, io) {
    const { name, email, phone, password, role, verifiedToken } = userData;

    if (!verifiedToken) {
      throw new Error('Verification token is required.');
    }

    // 1. Verify the token
    let decoded;
    try {
      decoded = jwt.verify(verifiedToken, config.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired verification token.');
    }

    // 2. Check if email in token matches email in request
    if (decoded.email !== email) {
      throw new Error('Verification token does not match the provided email.');
    }

    // 3. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error('User with that email already exists.');
    }

    // 4. Get permissions for the role
    const permissions = await getPermissionsForRole(role);

    // 5. Create user (status will default to 'pending')
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      permissions,
    });

    // 6. Set approval status based on role
    let emailBody = '';
    if (user.role === 'passenger') {
      user.approvedStatus = 'approved';
      emailBody = 'Congratulations! Your account is now active. You can log in and start using Safary.';
    } else {
      emailBody = 'Welcome to Safary! Your account has been created and is now pending review by an administrator. We will notify you once it has been approved.';
    }

    await user.save();

    // 7. Send welcome/status notification
    await NotificationService.sendEmail({
      to: user.email,
      subject: 'Welcome to Safary!',
      context: {
        title: 'Welcome!',
        body: emailBody,
      }
    });

    // 8. Delete the OTP that was used for this registration
    console.log(`[AuthService.signup] Deleting OTP for email: ${user.email}`);
    await OTP.deleteOne({ email: user.email });
    console.log(`[AuthService.signup] Successfully deleted OTP for email: ${user.email}`);

    // 9. Don't return the password
    user.password = undefined;

    // 10. Emit a real-time event
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
    console.log(`[AuthService.generateAndSendOtp] Received request to generate OTP for email: ${email}`);

    // Generate OTP
    const otp = generateOTP();
    console.log(`[AuthService.generateAndSendOtp] Generated OTP for ${email}: ${otp}`);

    // Save OTP to DB
    try {
      console.log(`[AuthService.generateAndSendOtp] Attempting to save OTP for ${email} to the database.`);
      // Atomically find and update or create a new OTP
      await OTP.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log(`[AuthService.generateAndSendOtp] Successfully saved OTP for ${email} to the database.`);
    } catch (dbError) {
      console.error(`[AuthService.generateAndSendOtp] Database error saving OTP for ${email}:`, dbError);
      throw new Error('Could not save OTP to database.');
    }

    // Send email
    try {
      console.log(`[AuthService.generateAndSendOtp] Attempting to send OTP email to ${email}.`);
      await NotificationService.sendEmail({
        to: email,
        subject: 'Your Safary Verification Code',
        context: {
          title: 'Verification Code',
          body: 'Please use the following code to start your registration with Safary. The code is valid for 10 minutes.',
          otp: otp,
        }
      });
      console.log(`[AuthService.generateAndSendOtp] Successfully queued OTP email for ${email}.`);
    } catch (error) {
      console.error(`[AuthService.generateAndSendOtp] Failed to send OTP email to ${email}:`, error);
      // We are not throwing an error here to prevent leaking information about email existence.
      // The client will not know whether the email was sent or not.
    }

    console.log(`[AuthService.generateAndSendOtp] OTP process completed for ${email}.`);
    return { success: true };
  }

  /**
   * @description Verifies an OTP
   * @param {string} email - The user's email
   * @param {string} otp - The OTP from the user
   * @returns {Promise<boolean>}
   */
  async verifyOtp(email, otp) {
    console.log(`[AuthService.verifyOtp] Attempting to verify OTP for ${email}.`);
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      console.error(`[AuthService.verifyOtp] No OTP record found for ${email}.`);
      throw new Error('OTP_NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      console.error(`[AuthService.verifyOtp] OTP mismatch for ${email}.`);
      throw new Error('OTP_MISMATCH');
    }

    console.log(`[AuthService.verifyOtp] OTP successfully verified for ${email}.`);
    // OTP is correct, but don't delete it yet. It will be deleted upon successful signup.
    return true;
  }

  /**
   * @description Verifies an OTP and issues a short-lived token for signup completion.
   * @param {string} email - The user's email
   * @param {string} otp - The OTP from the user
   * @returns {Promise<{verifiedToken: string}>}
   */
  async verifyOtpAndIssueToken(email, otp) {
    console.log(`[AuthService.verifyOtpAndIssueToken] Received request for ${email}.`);
    try {
      await this.verifyOtp(email, otp);

      // OTP is valid, issue a short-lived JWT for completing registration
      const payload = { email };
      const verifiedToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: '15m', // Token is valid for 15 minutes
      });

      console.log(`[AuthService.verifyOtpAndIssueToken] Successfully issued verification token for ${email}.`);
      return { verifiedToken };
    } catch (error) {
      console.error(`[AuthService.verifyOtpAndIssueToken] Verification failed for ${email}: ${error.message}`);
      // Translate internal errors to a user-friendly message
      if (error.message === 'OTP_NOT_FOUND' || error.message === 'OTP_MISMATCH') {
        throw new Error('Invalid or expired OTP.');
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }
}

module.exports = new AuthService();
