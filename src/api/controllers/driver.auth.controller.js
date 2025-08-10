const DriverAuthService = require('../services/driver.auth.service');

/**
 * @class DriverAuthController
 * @description Controller for driver authentication
 */
class DriverAuthController {
  async signup(req, res, next) {
    try {
      const result = await DriverAuthService.signup(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { emailOrPhone, password } = req.body;
      const result = await DriverAuthService.login(emailOrPhone, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverAuthController();
