const QueueManager = require('../models/queueManager.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt.util');
const { getPermissionsForRole } = require('../../config/permissions');
const NotificationService = require('./notification.service');
const config = require('../../config');

/**
 * @class QueueManagerAuthService
 * @description Handles authentication logic for queue managers.
 */
class QueueManagerAuthService {
  /**
   * @description Registers a new queue manager after OTP verification.
   */
  static async signup(queueManagerData, io) {
    const { name, email, phone, password, verifiedToken } = queueManagerData;

    if (!verifiedToken) throw new Error('Verification token is required.');
    jwt.verify(verifiedToken, config.jwtSecret);

    const queueManagerExists = await QueueManager.findOne({ email });
    if (queueManagerExists) throw new Error('QueueManager with that email already exists.');

    const permissions = await getPermissionsForRole('Queue Manager');

    const queueManager = new QueueManager({
      name,
      email,
      phone,
      password,
      permissions,
      verified: { email: true, phone: false },
    });

    await queueManager.save();

    const emailBody = 'Welcome to Safary! Your Queue Manager account has been created and is now pending review. We will notify you once it has been approved.';
    await NotificationService.sendEmail({
      to: queueManager.email,
      subject: 'Welcome to Safary!',
      context: { title: 'Welcome!', body: emailBody },
    });

    await OTP.deleteOne({ email: queueManager.email });

    queueManager.password = undefined;
    io.emit('queueManagerRegistered', { queueManager });

    return { queueManager };
  }

  /**
   * @description Authenticates a queue manager.
   */
  static async login(emailOrPhone, password) {
    const queueManager = await QueueManager.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password +failedLoginAttempts +lockUntil');

    if (!queueManager) throw new Error('Invalid credentials');

    if (queueManager.lockUntil && queueManager.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((queueManager.lockUntil - Date.now()) / 60000);
        throw new Error(`Account is locked. Please try again in ${remainingMinutes} minutes.`);
    }

    if (queueManager.approvedStatus !== 'approved') {
        throw new Error(`Your account is currently ${queueManager.approvedStatus}. Please contact support.`);
    }

    const isMatch = await queueManager.matchPassword(password);

    if (!isMatch) {
      queueManager.failedLoginAttempts = (queueManager.failedLoginAttempts || 0) + 1;
      if (queueManager.failedLoginAttempts >= 3) {
        queueManager.lockUntil = new Date(Date.now() + 5 * 60 * 60 * 1000);
        queueManager.failedLoginAttempts = 0;
      }
      await queueManager.save();
      throw new Error('Invalid credentials');
    }

    if (queueManager.failedLoginAttempts > 0 || queueManager.lockUntil) {
      queueManager.failedLoginAttempts = 0;
      queueManager.lockUntil = null;
      await queueManager.save();
    }

    const token = generateToken(queueManager, 'queue_manager');

    const queueManagerResponse = queueManager.toObject();
    delete queueManagerResponse.password;
    delete queueManagerResponse.failedLoginAttempts;
    delete queueManagerResponse.lockUntil;

    return { queueManager: queueManagerResponse, token };
  }
}

module.exports = QueueManagerAuthService;
