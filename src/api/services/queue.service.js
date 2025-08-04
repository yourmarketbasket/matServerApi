const Queue = require('../models/queue.model');
const Trip = require('../models/trip.model');

/**
 * @class QueueService
 * @description Manages the business logic for vehicle queues
 */
class QueueService {
  /**
   * @description Retrieves the queue for a specific route
   * @param {string} routeId - The ID of the route
   * @returns {Promise<Array<object>>}
   */
  async getQueueByRoute(routeId) {
    const queues = await Queue.find({ routeId }).sort({ position: 1 });
    return { queues };
  }

  /**
   * @description Adds a trip to the queue
   * @param {string} tripId - The ID of the trip to add
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async addTripToQueue(tripId, io) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    // This is a simplified position assignment. A real implementation would be more robust.
    const lastPosition = await Queue.findOne({ routeId: trip.routeId }).sort({ position: -1 });
    const newPosition = lastPosition ? lastPosition.position + 1 : 1;

    const queueEntry = await Queue.create({
      tripId,
      position: newPosition,
      routeId: trip.routeId,
      class: trip.class,
    });

    io.emit('queueUpdated', { routeId: trip.routeId });
    return { queue: queueEntry };
  }

  /**
   * @description Removes a trip from the queue
   * @param {string} id - The ID of the queue entry to remove
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<void>}
   */
  async removeTripFromQueue(id, io) {
    const queueEntry = await Queue.findByIdAndDelete(id);
    if (queueEntry) {
      io.emit('queueUpdated', { routeId: queueEntry.routeId });
    }
  }
}

module.exports = new QueueService();
