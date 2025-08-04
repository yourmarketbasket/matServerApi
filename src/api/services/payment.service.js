const Payment = require('../models/payment.model');
const Ticket = require('../models/ticket.model');

/**
 * @class PaymentService
 * @description Manages payment processing logic
 */
class PaymentService {
  /**
   * @description Initiates a payment for a ticket
   * @param {object} paymentData - The payment details
   * @returns {Promise<object>}
   */
  async initiatePayment(paymentData) {
    // In a real app, this would call a payment gateway API and return a checkout URL or similar.
    // For now, we'll just create the payment record.
    const payment = await Payment.create(paymentData);
    return { payment };
  }

  /**
   * @description Confirms a payment after gateway callback
   * @param {string} id - The ID of the payment to confirm
   * @param {string} status - The new status ('completed' or 'failed')
   * @param {object} io - The Socket.IO instance
   * @returns {Promise<object>}
   */
  async confirmPayment(id, status, io) {
    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (status === 'completed') {
      // If payment is successful, update the ticket status to 'paid'
      await Ticket.findByIdAndUpdate(payment.ticketId, { status: 'paid', paymentId: payment._id });
      io.emit('paymentConfirmed', { payment });
    } else {
      io.emit('paymentFailed', { payment });
    }
    return { payment };
  }

  /**
   * @description Retrieves all payments for a given Sacco
   * @param {string} saccoId - The ID of the Sacco
   * @returns {Promise<Array<object>>}
   */
  async getPaymentsBySacco(saccoId) {
    console.log(`Fetching payments for Sacco ${saccoId}`);
    // TODO: This would require a join/lookup. Find tickets for the Sacco, then find payments for those tickets.
    return { payments: [{ amount: 1500, status: 'completed' }] };
  }

  /**
   * @description Retrieves all payments for a given vehicle owner
   * @param {string} ownerId - The ID of the owner
   * @returns {Promise<Array<object>>}
   */
  async getPaymentsByOwner(ownerId) {
    console.log(`Fetching payments for owner ${ownerId}`);
    // TODO: Similar to above, requires finding trips by owner, then tickets, then payments.
    return { payments: [{ amount: 1200, status: 'completed' }] };
  }
}

module.exports = new PaymentService();
