const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const driverSchema = baseSchema.clone();

// Add fields specific to Drivers
driverSchema.add({
  licenseNumber: {
    type: String,
    required: [true, 'Please provide a license number'],
    unique: true,
  },
  ntsaCompliance: {
    type: Boolean,
    default: false,
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  performanceMetrics: {
    averageRating: { type: Number, default: 5.0 },
    completedTrips: { type: Number, default: 0 },
    safetyIncidents: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model('Driver', driverSchema);
