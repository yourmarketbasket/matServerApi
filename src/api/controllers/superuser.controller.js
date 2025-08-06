const SuperuserService = require('../services/superuser.service');

/**
 * @class SuperuserController
 * @description Controller for superuser-only operations
 */
class SuperuserController {
  async registerSuperuser(req, res, next) {
    try {
      const { adminKey, ...userData } = req.body;
      const result = await SuperuserService.registerSuperuser(userData, adminKey, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async loginSuperuser(req, res, next) {
    try {
      const { emailOrPhone, password, mfaCode } = req.body;
      const result = await SuperuserService.loginSuperuser(emailOrPhone, password, mfaCode);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createStaff(req, res, next) {
    try {
      const result = await SuperuserService.createSupportStaff(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateStaff(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SuperuserService.updateSupportStaff(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteStaff(req, res, next) {
    try {
      const { id } = req.params;
      await SuperuserService.deleteSupportStaff(id, req.io);
      res.status(200).json({ success: true, message: 'Support staff deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(req, res, next) {
    try {
      const metrics = await SuperuserService.getSystemMetrics();
      res.status(200).json({ success: true, data: { metrics } });
    } catch (error) {
      next(error);
    }
  }

  async setFarePolicy(req, res, next) {
    try {
      const policy = await SuperuserService.setFarePolicy(req.body, req.io);
      res.status(200).json({ success: true, data: { policy } });
    } catch (error) {
      next(error);
    }
  }

  async setSystemFee(req, res, next) {
    try {
      const policy = await SuperuserService.setSystemFeePolicy(req.body, req.io);
      res.status(200).json({ success: true, data: { policy } });
    } catch (error) {
      next(error);
    }
  }

  async setLoyaltyPolicy(req, res, next) {
    try {
      const policy = await SuperuserService.setLoyaltyPolicy(req.body, req.io);
      res.status(200).json({ success: true, data: { policy } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SuperuserController();
