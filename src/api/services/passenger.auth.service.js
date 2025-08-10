const Passenger = require('../models/passenger.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/jwt.util');
const { getPermissionsForRole } = require('../../config/permissions');
const NotificationService = require('./notification.service');
const config = require('../../config');

/**
 * @class PassengerAuthService
 * @description Handles authentication logic for passengers.
 */
class PassengerAuthService {
  /**
   * @description Registers a new passenger after OTP verification.
   * @param {object} passengerData - The passenger's data.
   * @param {object} io - The Socket.IO instance.
   * @returns {Promise<{passenger: object}>}
   */
  static async signup(passengerData, io) {
    const { name, email, phone, password, verifiedToken } = passengerData;

    if (!verifiedToken) {
      throw new Error('Verification token is required.');
    }

    // 1. Verify the token
    jwt.verify(verifiedToken, config.jwtSecret);

    // 2. Check if passenger already exists
    const passengerExists = await Passenger.findOne({ email });
    if (passengerExists) {
      throw new Error('Passenger with that email already exists.');
    }

    // 3. Get permissions for the 'passenger' role
    const permissions = await getPermissionsForRole('Passenger');

    // 4. Create a new passenger instance
    const passenger = new Passenger({
      name,
      email,
      phone,
      password,
      permissions,
      approvedStatus: 'approved', // Passengers are auto-approved
      verified: { email: true, phone: false },
    });

    // 5. Save the new passenger
    await passenger.save();

    // 6. Send welcome notification
    const emailBody = 'Congratulations! Your account is now active. You can log in and start using Safary.';
    await NotificationService.sendEmail({
      to: passenger.email,
      subject: 'Welcome to Safary!',
      context: { title: 'Welcome!', body: emailBody },
    });

    // 7. Delete the OTP
    await OTP.deleteOne({ email: passenger.email });

    // 8. Don't return password
    passenger.password = undefined;

    io.emit('passengerRegistered', { passenger });

    return { passenger };
  }

  /**
   * @description Authenticates a passenger.
   * @param {string} emailOrPhone - The passenger's email or phone.
   * @param {string} password - The passenger's password.
   * @returns {Promise<{passenger: object, token: string}>}
   */
  static async login(emailOrPhone, password) {
    const passenger = await Passenger.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    }).select('+password +failedLoginAttempts +lockUntil');

    if (!passenger) {
      throw new Error('Invalid credentials');
    }

    if (passenger.lockUntil && passenger.lockUntil > Date.now()) {
        const remainingMinutes = Math.ceil((passenger.lockUntil - Date.now()) / 60000);
        throw new Error(`Account is locked due to too many failed login attempts. Please try again in ${remainingMinutes} minutes.`);
    }

    const isMatch = await passenger.matchPassword(password);

    if (!isMatch) {
      passenger.failedLoginAttempts = (passenger.failedLoginAttempts || 0) + 1;
      if (passenger.failedLoginAttempts >= 3) {
        passenger.lockUntil = new Date(Date.now() + 5 * 60 * 60 * 1000);
        passenger.failedLoginAttempts = 0;
      }
      await passenger.save();
      throw new Error('Invalid credentials');
    }

    if (passenger.failedLoginAttempts > 0 || passenger.lockUntil) {
      passenger.failedLoginAttempts = 0;
      passenger.lockUntil = null;
      await passenger.save();
    }

    const token = generateToken(passenger, 'passenger');

    const passengerResponse = passenger.toObject();
    delete passengerResponse.password;
    delete passengerResponse.failedLoginAttempts;
    delete passengerResponse.lockUntil;

    return { passenger: passengerResponse, token };
  }
}

module.exports = PassengerAuthService;
