const RouteService = require('../services/route.service');

/**
 * @class RouteController
 * @description Controller for route management
 */
class RouteController {
  async getRoutes(req, res, next) {
    try {
      const { saccoId } = req.query;
      const result = await RouteService.getRoutes(saccoId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RouteController();
