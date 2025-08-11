const Driver = require('../models/driver.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt.util');
const { getPermissionsForRole } = require('../../config/permissions');
const NotificationService = require('./notification.service');
const config = require('../../config');

/**
 * @class DriverAuthService
 * @description Handles authentication logic for drivers.
 */
class DriverAuthService {
  /**
   * @description Registers a new driver after OTP verification.
   */
  static async signup(driverData, io) {
    const {
      name,
      email,
      phone,
      password,
      licenseNumber,
      saccoId,
      verifiedToken,
      idNumber,
      idPhotoFront,
      idPhotoBack,
      drivingLicenseExpiry,
      drivingLicensePhoto,
      dob,
      gender,
    } = driverData;

    if (!verifiedToken) throw new Error('Verification token is required.');
    jwt.verify(verifiedToken, config.jwtSecret);

    const driverExists = await Driver.findOne({ email });
    if (driverExists) throw new Error('Driver with that email already exists.');

    const permissions = await getPermissionsForRole('Driver');

    const driver = new Driver({
      name,
      email,
      phone,
      password,
      role: 'Driver',
      licenseNumber,
      saccoId,
      idNumber,
      idPhotoFront,
      idPhotoBack,
      drivingLicenseExpiry,
      drivingLicensePhoto,
      dob,
      gender,
      permissions,
      verified: { email: true, phone: false },
    });

    await driver.save();

    const emailBody = 'Welcome to Safary! Your driver account has been created and is now pending review. We will notify you once it has been approved.';
    await NotificationService.sendEmail({
      to: driver.email,
      subject: 'Welcome to Safary!',
      context: { title: 'Welcome!', body: emailBody },
    });

    await OTP.deleteOne({ email: driver.email });

    driver.password = undefined;
    io.emit('driverRegistered', { driver });

    return { driver };
  }

  /**
   * @description Authenticates a driver.
   */
  static async login(emailOrPhone, password) {
    const driver = await Driver.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password +failedLoginAttempts +lockUntil');

    if (!driver) throw new Error('Invalid credentials');

    if (driver.lockUntil && driver.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((driver.lockUntil - Date.now()) / 60000);
        throw new Error(`Account is locked. Please try again in ${remainingMinutes} minutes.`);
    }

    if (driver.approvedStatus !== 'approved') {
        throw new Error(`Your account is currently ${driver.approvedStatus}. Please contact support.`);
    }

    const isMatch = await driver.matchPassword(password);

    if (!isMatch) {
      driver.failedLoginAttempts = (driver.failedLoginAttempts || 0) + 1;
      if (driver.failedLoginAttempts >= 3) {
        driver.lockUntil = new Date(Date.now() + 5 * 60 * 60 * 1000);
        driver.failedLoginAttempts = 0;
      }
      await driver.save();
      throw new Error('Invalid credentials');
    }

    if (driver.failedLoginAttempts > 0 || driver.lockUntil) {
      driver.failedLoginAttempts = 0;
      driver.lockUntil = null;
      await driver.save();
    }

    const token = generateToken(driver, 'driver');

    const driverResponse = driver.toObject();
    delete driverResponse.password;
    delete driverResponse.failedLoginAttempts;
    delete driverResponse.lockUntil;

    return { driver: driverResponse, token };
  }
}

module.exports = DriverAuthService;
