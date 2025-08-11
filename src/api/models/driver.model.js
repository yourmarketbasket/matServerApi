const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const driverSchema = baseSchema.clone();

// Add fields specific to Drivers
driverSchema.add({
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
  },
  drivingLicenseExpiry: {
    type: Date,
    required: [true, 'Driving license expiry date is required'],
  },
  drivingLicensePhoto: {
    type: String,
    required: [true, 'Driving license photo is required'],
  },
  idNumber: {
    type: String,
    required: [true, 'ID number is required'],
    unique: true,
  },
  idPhotoFront: {
    type: String,
    required: [true, 'Front of ID photo is required'],
  },
  idPhotoBack: {
    type: String,
    required: [true, 'Back of ID photo is required'],
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
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

// Make date of birth required for drivers
driverSchema.path('dob').required(true, 'Date of birth is required for drivers.');

// Custom validator for age
driverSchema.path('dob').validate(function (value) {
  if (!value) return false;
  const today = new Date();
  const birthDate = new Date(value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 24;
}, 'Driver must be at least 24 years old.');

module.exports = mongoose.model('Driver', driverSchema);
