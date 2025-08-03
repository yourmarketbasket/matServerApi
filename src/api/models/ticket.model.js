const mongoose = require('mongoose');
const crypto = require('crypto');

const TicketSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first_class'],
    required: true,
  },
  registrationTimestamp: {
    type: Date,
    default: Date.now,
  },
  qrCode: {
    type: String,
    unique: true,
  },
  ticketId: { // Short code for USSD
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ['registered', 'paid', 'boarded', 'canceled'],
    default: 'registered',
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  systemFee: {
    type: Number,
    required: true,
    min: 10,
    max: 100,
  },
  discountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
  },
});

// Generate QR code and short ticketId before saving
TicketSchema.pre('save', function(next) {
  if (this.isNew) {
    // A more robust QR code might include trip and passenger details
    this.qrCode = crypto.createHash('sha256').update(this._id.toString()).digest('hex');
    // Generate a short, human-readable ticket ID
    this.ticketId = `SAFAREASY-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', TicketSchema);
