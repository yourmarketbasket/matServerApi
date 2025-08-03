const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
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
  status: {
    type: String,
    enum: ['pending', 'active', 'canceled', 'completed'],
    default: 'pending',
  },
  departureTimestamp: {
    type: Date,
  },
  completionTimestamp: {
    type: Date,
  },
});

module.exports = mongoose.model('Trip', TripSchema);
