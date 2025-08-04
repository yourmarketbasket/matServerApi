const Route = require('../models/route.model');
const FareAdjustment = require('../models/fareAdjustment.model');

/**
 * @class RouteService
 * @description Manages all business logic for routes
 */
class RouteService {
  /**
   * @description Retrieves routes, optionally filtered by Sacco
   * @param {string} [saccoId] - The ID of the Sacco to filter by
   * @returns {Promise<Array<object>>}
   */
  async getRoutes(saccoId) {
    let query = {};
    if (saccoId) {
      query.saccoId = saccoId;
    }
    const routes = await Route.find(query);
    return { routes };
  }

  /**
   * @description Creates a new route
   * @param {object} routeData - The data for the new route
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createRoute(routeData, io) {
    const route = await Route.create(routeData);
    io.emit('routeCreated', { route });
    return { route };
  }

  /**
   * @description Updates an existing route
   * @param {string} id - The ID of the route to update
   * @param {object} routeData - The updated data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateRoute(id, routeData, io) {
    const route = await Route.findByIdAndUpdate(id, routeData, { new: true });
    io.emit('routeUpdated', { route });
    return { route };
  }

  /**
   * @description Finalizes a draft route
   * @param {string} id - The ID of the route to finalize
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async finalizeRoute(id, io) {
    const route = await Route.findByIdAndUpdate(id, { status: 'finalized' }, { new: true });
    io.emit('routeUpdated', { route });
    return { route };
  }

  /**
   * @description Deletes a route
   * @param {string} id - The ID of the route to delete
   * @returns {Promise<void>}
   */
  async deleteRoute(id) {
    await Route.findByIdAndDelete(id);
  }

  /**
   * @description Adjusts the fare for a specific route
   * @param {string} routeId - The ID of the route
   * @param {object} adjustmentData - The fare adjustment data
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async adjustFare(routeId, adjustmentData, io) {
    const adjustment = await FareAdjustment.create({ ...adjustmentData, routeId });
    // Also update the route to link the adjustment
    await Route.findByIdAndUpdate(routeId, { $push: { fareAdjustments: adjustment._id } });
    io.emit('fareAdjusted', { routeId, adjustment });
    return { adjustment };
  }
}

module.exports = new RouteService();
