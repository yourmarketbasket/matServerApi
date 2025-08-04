const Reallocation = require('../models/reallocation.model');
const Ticket = require('../models/ticket.model');

/**
 * @class ReallocationService
 * @description Manages the logic for reallocating tickets
 */
class ReallocationService {
  /**
   * @description Automatically reallocates all tickets from a canceled trip
   * @param {string} tripId - The ID of the canceled trip
   * @param {string} reason - The reason for cancellation
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<Array<object>>}
   */
  async autoReallocateTickets(tripId, reason, io) {
    // This is a placeholder for a very complex operation.
    console.log(`Auto-reallocating tickets for canceled trip ${tripId} due to: ${reason}`);
    io.emit('ticketsReallocated', { originalTripId: tripId, reason });
    return { reallocations: [] };
  }

  /**
   * @description Manually reallocates a single ticket to a new trip
   * @param {string} ticketId - The ID of the ticket to reallocate
   * @param {string} newTripId - The ID of the new trip
   * @param {string} reallocatedBy - The ID of the user performing the reallocation
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async manualReallocateTicket(ticketId, newTripId, reallocatedBy, io) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new Error('Ticket not found');
    }
    const originalTripId = ticket.tripId;

    ticket.tripId = newTripId;
    await ticket.save();

    const reallocation = await Reallocation.create({
      ticketId,
      originalTripId,
      newTripId,
      reason: 'Manual reallocation by support staff',
      reallocatedBy
    });

    io.emit('ticketReallocated', { ticketId, newTripId });

    return { reallocation };
  }
}

module.exports = new ReallocationService();
