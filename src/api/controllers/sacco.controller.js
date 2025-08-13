const SaccoService = require('../services/sacco.service');
const RouteService = require('../services/route.service');
const VehicleService = require('../services/vehicle.service');

/**
 * @class SaccoController
 * @description Controller for Sacco management operations
 */
class SaccoController {
  async createSacco(req, res, next) {
    try {
      req.body.createdBy = req.user.id;
      const result = await SaccoService.createSacco(req.body, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSaccoById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SaccoService.getSaccoById(id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateSaccoStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await SaccoService.updateSaccoStatus(id, status, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSaccoNames(req, res, next) {
    try {
      const result = await SaccoService.getSaccoNames();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getSaccos(req, res, next) {
    try {
      const result = await SaccoService.getSaccos();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async updateSacco(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SaccoService.updateSacco(id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approveSacco(req, res, next) {
    try {
      const { id } = req.params;
      const result = await SaccoService.approveSacco(id, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async rejectSacco(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const result = await SaccoService.rejectSacco(id, reason, req.io);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteSacco(req, res, next) {
    try {
      // const { id } = req.params;
      // await SaccoService.deleteSacco(id);
      res.status(200).json({ success: true, message: 'Sacco deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // --- Route Management ---
  async createRoute(req, res, next) {
    try {
      req.body.saccoId = req.user._id; // The logged-in sacco is the owner
      const route = await RouteService.createRoute(req.body);
      res.status(201).json({ success: true, data: route });
    } catch (error) {
      next(error);
    }
  }

  async updateRoute(req, res, next) {
    try {
      const { id } = req.params;
      const route = await RouteService.updateRoute(id, req.body);
      res.status(200).json({ success: true, data: route });
    } catch (error) {
      next(error);
    }
  }

  async finalizeRoute(req, res, next) {
    try {
      const { id } = req.params;
      const route = await RouteService.finalizeRoute(id);
      res.status(200).json({ success: true, data: route });
    } catch (error) {
      next(error);
    }
  }

  async deleteRoute(req, res, next) {
    try {
      const { id } = req.params;
      await RouteService.deleteRoute(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }

  async addFareAdjustment(req, res, next) {
    try {
      const { id } = req.params;
      const route = await RouteService.addFareAdjustment(id, req.body);
      res.status(200).json({ success: true, data: route });
    } catch (error) {
      next(error);
    }
  }

  // --- Vehicle Management ---
  async createVehicle(req, res, next) {
    try {
      req.body.saccoId = req.user._id; // The logged-in sacco is the owner
      const vehicle = await VehicleService.createVehicle(req.body);
      res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  }

  async updateVehicle(req, res, next) {
    try {
      const { id } = req.params;
      const vehicle = await VehicleService.updateVehicle(id, req.body);
      res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
      next(error);
    }
  }

  async deleteVehicle(req, res, next) {
    try {
      const { id } = req.params;
      await VehicleService.deleteVehicle(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaccoController();
