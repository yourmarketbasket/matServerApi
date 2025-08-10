const SaccoAuthService = require('../services/sacco.auth.service');

/**
 * @class SaccoAuthController
 * @description Controller for sacco authentication
 */
class SaccoAuthController {
  async signup(req, res, next) {
    try {
      const result = await SaccoAuthService.signup(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { emailOrPhone, password } = req.body;
      const result = await SaccoAuthService.login(emailOrPhone, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaccoAuthController();
