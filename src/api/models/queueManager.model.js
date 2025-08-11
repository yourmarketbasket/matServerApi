const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const queueManagerSchema = baseSchema.clone();

// Add fields specific to QueueManagers
queueManagerSchema.add({
  idNumber: {
    type: String,
    required: [true, 'ID number is required'],
    unique: true,
  },
  drivingLicense: {
    type: String,
    required: [true, 'Driving license is required'],
  },
  medicalCertificate: {
    type: String,
  },
  psvConductorBadge: {
    type: String,
  },
  employmentAffiliationProof: {
    type: String,
  },
});

// Make date of birth required for queue managers
queueManagerSchema.path('dob').required(true, 'Date of birth is required for queue managers.');

// Custom validator for age
queueManagerSchema.path('dob').validate(function (value) {
  if (!value) return false;
  const today = new Date();
  const birthDate = new Date(value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 21 && age <= 60;
}, 'Queue Manager must be between 21 and 60 years old.');

module.exports = mongoose.model('QueueManager', queueManagerSchema);
