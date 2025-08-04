const Trip = require('../models/trip.model');

/**
 * @class TripService
 * @description Handles business logic for trips
 */
class TripService {
  /**
   * @description Registers a new trip
   * @param {object} tripData - The data for the new trip
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async registerTrip(tripData, io) {
    const trip = await Trip.create(tripData);
    io.emit('tripRegistered', { trip });
    return { trip };
  }

  /**
   * @description Retrieves all trips for a given route
   * @param {string} routeId - The ID of the route
   * @returns {Promise<Array<object>>}
   */
  async getTripsByRoute(routeId) {
    const trips = await Trip.find({ routeId });
    return { trips };
  }

  /**
   * @description Cancels a trip
   * @param {string} id - The ID of the trip to cancel
   * @param {string} reason - The reason for cancellation
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<void>}
   */
  async cancelTrip(id, reason, io) {
    const trip = await Trip.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
    io.emit('tripStatusChanged', { tripId: id, status: 'canceled', reason });
    // Here you would also trigger the ticket reallocation service
  }

  /**
   * @description Marks a trip as completed
   * @param {string} id - The ID of the trip to complete
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async completeTrip(id, io) {
    const trip = await Trip.findByIdAndUpdate(id, { status: 'completed', completionTimestamp: new Date() }, { new: true });
    io.emit('tripStatusChanged', { tripId: id, status: 'completed' });
    // Here you would trigger the payroll service
    return { trip };
  }
}

module.exports = new TripService();
