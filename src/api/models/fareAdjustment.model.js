const mongoose = require('mongoose');

const FareAdjustmentSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  factor: {
    type: String,
    enum: ['fuel_price', 'time_of_day', 'weather', 'special_event', 'other'],
    required: [true, 'Please specify the adjustment factor'],
  },
  multiplier: {
    type: Number,
    required: [true, 'A multiplier is required'],
    min: [0.1, 'Multiplier must be at least 0.1'],
    max: [5.0, 'Multiplier cannot exceed 5.0'],
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first_class', 'all'],
    required: true,
    default: 'all',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  adjustedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Superuser or Sacco Admin
    required: true,
  },
  description: {
      type: String,
  }
});

module.exports = mongoose.model('FareAdjustment', FareAdjustmentSchema);
