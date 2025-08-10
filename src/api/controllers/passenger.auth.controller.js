const PassengerAuthService = require('../services/passenger.auth.service');

/**
 * @class PassengerAuthController
 * @description Controller for passenger authentication
 */
class PassengerAuthController {
  async signup(req, res, next) {
    try {
      const result = await PassengerAuthService.signup(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { emailOrPhone, password } = req.body;
      const result = await PassengerAuthService.login(emailOrPhone, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PassengerAuthController();
