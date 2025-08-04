const Ticket = require('../models/ticket.model');

/**
 * @class TicketService
 * @description Handles all business logic for tickets
 */
class TicketService {
  /**
   * @description Registers a new ticket for a passenger
   * @param {object} ticketData - The data for the new ticket
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<{ticket: object}>}
   */
  async registerTicket(ticketData, io) {
    // In a real app, you'd validate discount codes, calculate fares, etc.
    const ticket = await Ticket.create(ticketData);
    io.emit('ticketRegistered', { ticket });
    return { ticket };
  }

  /**
   * @description Retrieves all tickets for a specific user
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array<object>>}
   */
  async getUserTickets(userId) {
    const tickets = await Ticket.find({ passengerId: userId });
    return { tickets };
  }

  /**
   * @description Scans and validates a ticket using its QR code
   * @param {string} qrCode - The QR code data from the ticket
   * @returns {Promise<object>}
   */
  async scanTicket(qrCode) {
    const ticket = await Ticket.findOne({ qrCode });
    return { ticket };
  }

  /**
   * @description Updates the status of a ticket
   * @param {string} id - The ID of the ticket
   * @param {string} status - The new status (e.g., 'boarded', 'canceled')
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async updateTicketStatus(id, status, io) {
    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
    io.emit('ticketStatusChanged', { ticketId: id, status });
    return { ticket };
  }

  /**
   * @description Reallocates a ticket to a new trip
   * @param {string} id - The ID of the ticket to reallocate
   * @param {string} newTripId - The ID of the new trip
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async reallocateTicket(id, newTripId, io) {
    const ticket = await Ticket.findByIdAndUpdate(id, { tripId: newTripId }, { new: true });
    io.emit('ticketReallocated', { ticketId: id, newTripId });
    return { ticket };
  }
}

module.exports = new TicketService();
