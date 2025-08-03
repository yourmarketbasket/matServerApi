const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One user profile should correspond to one driver profile
  },
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
  // A driver might be assigned to a primary vehicle
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Driver', DriverSchema);
