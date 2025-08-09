const Dispute = require('../models/dispute.model');

/**
 * @class SupportService
 * @description Manages support tickets (disputes) and escalations
 */
class SupportService {
  /**
   * @description Creates a new support ticket
   * @param {object} ticketData - The data for the new ticket
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createTicket(ticketData, io) {
    const ticket = await Dispute.create(ticketData);
    // Notify support staff room
    io.to('support_staff').emit('newTicket', { ticket });
    return ticket;
  }

  /**
   * @description Get tickets based on user role
   * @param {object} user - The user object
   * @returns {Promise<object[]>} A list of tickets
   */
  async getTickets(user) {
    if (user.role === 'support_staff' || user.role === 'admin' || user.role === 'superuser') {
      return await Dispute.find().populate('raisedBy', 'name email');
    }
    return await Dispute.find({ raisedBy: user._id }).populate('raisedBy', 'name email');
  }

  /**
   * @description Get a single ticket by its ID
   * @param {string} ticketId - The ID of the ticket to retrieve
   * @returns {Promise<object>} The ticket object
   */
  async getTicketById(ticketId) {
    const ticket = await Dispute.findById(ticketId).populate('raisedBy', 'name email').populate('assignedTo', 'name email');
    if (!ticket) {
      throw new Error('Ticket not found.');
    }
    return ticket;
  }

  /**
   * @description Updates a ticket
   * @param {string} ticketId - The ID of the ticket to update
   * @param {object} updateData - The data to update
   * @returns {Promise<object>} The updated ticket object
   */
  async updateTicket(ticketId, updateData) {
    const ticket = await Dispute.findByIdAndUpdate(ticketId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!ticket) {
      throw new Error('Ticket not found.');
    }
    return ticket;
  }

  /**
   * @description Deletes a ticket
   * @param {string} ticketId - The ID of the ticket to delete
   * @returns {Promise<object>}
   */
  async deleteTicket(ticketId) {
    const ticket = await Dispute.findByIdAndDelete(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found.');
    }
    return ticket;
  }

  /**
   * @description Escalates a ticket to a higher level
   * @param {string} ticketId - The ID of the ticket to escalate
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async escalateTicket(ticketId, io) {
    const ticket = await Dispute.findByIdAndUpdate(ticketId, { status: 'escalated' }, { new: true });
    // Notify admin room
    io.to('admins').emit('ticketEscalated', { ticket });
    return ticket;
  }
}

module.exports = new SupportService();
