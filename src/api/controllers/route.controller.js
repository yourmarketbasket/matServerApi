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

  async createRoute(req, res, next) {
    try {
      const result = await RouteService.createRoute(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req, res, next) {
    try {
      const { id } = req.params;
      const result = await RouteService.updateRoute(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async finalizeRoute(req, res, next) {
    try {
      const { id } = req.params;
      const result = await RouteService.finalizeRoute(id, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoute(req, res, next) {
    try {
      const { id } = req.params;
      await RouteService.deleteRoute(id);
      res.status(200).json({ success: true, message: 'Route deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async addFareAdjustment(req, res, next) {
    try {
      const { id } = req.params;
      const result = await RouteService.adjustFare(id, req.body, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RouteController();
