const QueueManagerAuthService = require('../services/queueManager.auth.service');

/**
 * @class QueueManagerAuthController
 * @description Controller for QueueManager authentication
 */
class QueueManagerAuthController {
  async signup(req, res, next) {
    try {
      const result = await QueueManagerAuthService.signup(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { emailOrPhone, password } = req.body;
      const result = await QueueManagerAuthService.login(emailOrPhone, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueueManagerAuthController();
