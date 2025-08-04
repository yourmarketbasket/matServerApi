const AuthService = require('../services/auth.service');

/**
 * @class AuthController
 * @description Controller for authentication-related operations
 */
class AuthController {
  async login(req, res, next) {
    try {
      const { email, password, mfaCode } = req.body;
      const result = await AuthService.login(email, password, mfaCode);
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

  async registerSuperuser(req, res, next) {
    try {
      const { adminKey, ...userData } = req.body;
      const result = await AuthService.registerSuperuser(userData, adminKey, req.io);
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
      const result = await AuthService.verifyMFA(req.user._id, token);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
