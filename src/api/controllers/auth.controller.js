const AuthService = require('../services/auth.service');

/**
 * @class AuthController
 * @description Controller for authentication-related operations
 */
class AuthController {
  async login(req, res, next) {
    try {
      const { emailOrPhone, password, mfaCode } = req.body;
      const result = await AuthService.login(emailOrPhone, password, mfaCode);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.generateAndSendOtp(email);
      res.status(200).json({ success: true, message: 'If an account with that email exists, an OTP has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await AuthService.verifyOtpAndIssueToken(email, otp);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async signup(req, res, next) {
    try {
      const result = await AuthService.signup(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.status(200).json({ success: true, message: 'If a user with that email exists, a password reset token has been sent.' });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async setupMFA(req, res, next) {
    try {
      // The user ID should come from the authenticated user session (req.user)
      const result = await AuthService.setupMFA(req.user._id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async verifyMFA(req, res, next) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyMFA(req.user._id, token, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
