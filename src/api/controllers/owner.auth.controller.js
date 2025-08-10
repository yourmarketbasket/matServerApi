const OwnerAuthService = require('../services/owner.auth.service');

/**
 * @class OwnerAuthController
 * @description Controller for owner authentication
 */
class OwnerAuthController {
  async signup(req, res, next) {
    try {
      const result = await OwnerAuthService.signup(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { emailOrPhone, password } = req.body;
      const result = await OwnerAuthService.login(emailOrPhone, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OwnerAuthController();
