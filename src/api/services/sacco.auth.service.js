const Sacco = require('../models/sacco.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt.util');
const { getPermissionsForRole } = require('../../config/permissions');
const NotificationService = require('./notification.service');
const config = require('../../config');

/**
 * @class SaccoAuthService
 * @description Handles authentication logic for saccos.
 */
class SaccoAuthService {
  /**
   * @description Registers a new sacco after OTP verification.
   */
  static async signup(saccoData, io) {
    const { name, email, phone, password, license, contactPerson, verifiedToken } = saccoData;

    if (!verifiedToken) throw new Error('Verification token is required.');
    jwt.verify(verifiedToken, config.jwtSecret);

    const saccoExists = await Sacco.findOne({ email });
    if (saccoExists) throw new Error('Sacco with that email already exists.');

    const permissions = await getPermissionsForRole('Sacco');

    const sacco = new Sacco({
      name,
      email,
      phone,
      password,
      license,
      contactPerson,
      permissions,
      verified: { email: true, phone: false },
    });

    await sacco.save();

    const emailBody = 'Welcome to Safary! Your Sacco account has been created and is now pending review. We will notify you once it has been approved.';
    await NotificationService.sendEmail({
      to: sacco.email,
      subject: 'Welcome to Safary!',
      context: { title: 'Welcome!', body: emailBody },
    });

    await OTP.deleteOne({ email: sacco.email });

    sacco.password = undefined;
    io.emit('saccoRegistered', { sacco });

    return { sacco };
  }

  /**
   * @description Authenticates a sacco.
   */
  static async login(emailOrPhone, password) {
    const sacco = await Sacco.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password +failedLoginAttempts +lockUntil');

    if (!sacco) throw new Error('Invalid credentials');

    if (sacco.lockUntil && sacco.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((sacco.lockUntil - Date.now()) / 60000);
        throw new Error(`Account is locked. Please try again in ${remainingMinutes} minutes.`);
    }

    if (sacco.approvedStatus !== 'approved') {
        throw new Error(`Your account is currently ${sacco.approvedStatus}. Please contact support.`);
    }

    const isMatch = await sacco.matchPassword(password);

    if (!isMatch) {
      sacco.failedLoginAttempts = (sacco.failedLoginAttempts || 0) + 1;
      if (sacco.failedLoginAttempts >= 3) {
        sacco.lockUntil = new Date(Date.now() + 5 * 60 * 60 * 1000);
        sacco.failedLoginAttempts = 0;
      }
      await sacco.save();
      throw new Error('Invalid credentials');
    }

    if (sacco.failedLoginAttempts > 0 || sacco.lockUntil) {
      sacco.failedLoginAttempts = 0;
      sacco.lockUntil = null;
      await sacco.save();
    }

    const token = generateToken(sacco, 'sacco');

    const saccoResponse = sacco.toObject();
    delete saccoResponse.password;
    delete saccoResponse.failedLoginAttempts;
    delete saccoResponse.lockUntil;

    return { sacco: saccoResponse, token };
  }
}

module.exports = SaccoAuthService;
