const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const passengerSchema = baseSchema.clone();

// Add fields specific to Passengers
passengerSchema.add({
  idNumber: {
    type: String,
  },
  paymentDetails: {
    type: Object,
  },
  emergencyContact: {
    name: String,
    phone: String,
  },
  locationPermissions: {
    type: Boolean,
    default: false,
  },
  dataPrivacyConsent: {
    type: Boolean,
    default: false,
  },
  optionalVerification: {
    type: Object,
  },
});

// Make date of birth required for passengers
passengerSchema.path('dob').required(true, 'Date of birth is required for passengers.');

// Custom validator for age
passengerSchema.path('dob').validate(function (value) {
  if (!value) return false;
  const today = new Date();
  const birthDate = new Date(value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
}, 'Passenger must be at least 18 years old.');

module.exports = mongoose.model('Passenger', passengerSchema);
