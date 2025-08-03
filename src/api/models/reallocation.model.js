const mongoose = require('mongoose');

const ReallocationSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  originalTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  newTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  reason: {
    type: String,
    required: [true, 'A reason for reallocation is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // To track who performed the reallocation
  reallocatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Could be support staff or an admin/system user
    required: true,
  },
});

module.exports = mongoose.model('Reallocation', ReallocationSchema);
