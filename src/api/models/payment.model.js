const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the payment amount'],
  },
  systemFee: {
    type: Number,
    required: true,
    min: 10,
    max: 100,
  },
  method: {
    type: String,
    enum: ['mpesa', 'card'],
    required: [true, 'Please specify the payment method'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  transactionId: { // To store the ID from the payment provider (e.g., M-Pesa)
    type: String,
  },
  // Adding reference to user for easier lookup of user payments
  passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
