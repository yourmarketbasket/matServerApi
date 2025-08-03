const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true, // A trip can only be in the queue once
  },
  position: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Denormalized fields for faster queries on the queue
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
});

// Ensure that for a given route and class, the position is unique
QueueSchema.index({ routeId: 1, class: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Queue', QueueSchema);
