const Owner = require('../models/owner.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt.util');
const { getPermissionsForRole } = require('../../config/permissions');
const NotificationService = require('./notification.service');
const config = require('../../config');

/**
 * @class OwnerAuthService
 * @description Handles authentication logic for owners.
 */
class OwnerAuthService {
  /**
   * @description Registers a new owner after OTP verification.
   */
  static async signup(ownerData, io) {
    const {
      name,
      email,
      phone,
      password,
      verifiedToken,
      idNumberOrBusinessRegNo,
      kraPinCertificate,
      saccoAffiliation,
    } = ownerData;

    if (!verifiedToken) throw new Error('Verification token is required.');
    jwt.verify(verifiedToken, config.jwtSecret);

    const ownerExists = await Owner.findOne({ email });
    if (ownerExists) throw new Error('Owner with that email already exists.');

    const permissions = await getPermissionsForRole('Owner');

    const owner = new Owner({
      name,
      email,
      phone,
      password,
      role: 'Owner',
      idNumberOrBusinessRegNo,
      kraPinCertificate,
      saccoAffiliation,
      permissions,
      verified: { email: true, phone: false },
    });

    await owner.save();

    const emailBody = 'Welcome to Safary! Your Owner account has been created and is now pending review. We will notify you once it has been approved.';
    await NotificationService.sendEmail({
      to: owner.email,
      subject: 'Welcome to Safary!',
      context: { title: 'Welcome!', body: emailBody },
    });

    await OTP.deleteOne({ email: owner.email });

    owner.password = undefined;
    io.emit('ownerRegistered', { owner });

    return { owner };
  }

  /**
   * @description Authenticates an owner.
   */
  static async login(emailOrPhone, password) {
    const owner = await Owner.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password +failedLoginAttempts +lockUntil');

    if (!owner) throw new Error('Invalid credentials');

    if (owner.lockUntil && owner.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((owner.lockUntil - Date.now()) / 60000);
        throw new Error(`Account is locked. Please try again in ${remainingMinutes} minutes.`);
    }

    if (owner.approvedStatus !== 'approved') {
        throw new Error(`Your account is currently ${owner.approvedStatus}. Please contact support.`);
    }

    const isMatch = await owner.matchPassword(password);

    if (!isMatch) {
      owner.failedLoginAttempts = (owner.failedLoginAttempts || 0) + 1;
      if (owner.failedLoginAttempts >= 3) {
        owner.lockUntil = new Date(Date.now() + 5 * 60 * 60 * 1000);
        owner.failedLoginAttempts = 0;
      }
      await owner.save();
      throw new Error('Invalid credentials');
    }

    if (owner.failedLoginAttempts > 0 || owner.lockUntil) {
      owner.failedLoginAttempts = 0;
      owner.lockUntil = null;
      await owner.save();
    }

    const token = generateToken(owner, 'owner');

    const ownerResponse = owner.toObject();
    delete ownerResponse.password;
    delete ownerResponse.failedLoginAttempts;
    delete ownerResponse.lockUntil;

    return { owner: ownerResponse, token };
  }
}

module.exports = OwnerAuthService;
