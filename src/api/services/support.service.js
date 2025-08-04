// The specification mentions 'Inquiry' and 'Escalation' but does not define models for them.
// For this service, we will assume the 'Dispute' model can be used for inquiries,
// or that specific models would be created later.

const Dispute = require('../models/dispute.model');

/**
 * @class SupportService
 * @description Manages support inquiries and escalations
 */
class SupportService {
  /**
   * @description Creates a new support inquiry
   * @param {object} inquiryData - The data for the new inquiry
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async createInquiry(inquiryData, io) {
    const inquiry = await Dispute.create(inquiryData);
    // Notify support staff room
    io.to('support_staff').emit('newInquiry', { inquiry });
    return { inquiry };
  }

  /**
   * @description Resolves an existing inquiry
   * @param {string} id - The ID of the inquiry to resolve
   * @param {string} resolution - The details of the resolution
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async resolveInquiry(id, resolution, io) {
    const inquiry = await Dispute.findByIdAndUpdate(id, { status: 'resolved', resolutionDetails: resolution }, { new: true });
    io.to('support_staff').emit('inquiryResolved', { inquiry });
    return { inquiry };
  }

  /**
   * @description Escalates an inquiry to a higher level
   * @param {string} id - The ID of the inquiry to escalate
   * @param {string} details - The details for the escalation
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async escalateInquiry(id, details, io) {
    const inquiry = await Dispute.findByIdAndUpdate(id, { status: 'escalated' }, { new: true });
    // Notify admin room
    io.to('admins').emit('inquiryEscalated', { inquiry, details });
    return { inquiry };
  }

  /**
   * @description Retrieves system-wide alerts
   * @returns {Promise<Array<object>>}
   */
  async getSystemAlerts() {
    console.log('Fetching system alerts');
    // TODO: Implement logic to detect system-wide issues (e.g., high failure rates)
    return { alerts: [{ type: 'HighCancellationRate', routeId: 'route123', details: 'Cancellation rate over 20%' }] };
  }
}

module.exports = new SupportService();
