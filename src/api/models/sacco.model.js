const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const saccoSchema = baseSchema.clone();

// Add fields specific to Saccos
saccoSchema.add({
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
  },
  byLawsDocument: {
    type: String,
    required: [true, 'By-laws document is required'],
  },
  leadershipInfoDocument: {
    type: String,
    required: [true, 'Leadership info document is required'],
  },
  registrationFeePaymentProof: {
    type: String,
    required: [true, 'Registration fee payment proof is required'],
  },
  membershipDetailsDocument: {
    type: String,
  },
  economicAppraisalDocument: {
    type: String,
  },
  transportSpecificAdditionsDocument: {
    type: String,
  },
});

// Remove irrelevant fields from the base schema for Saccos
saccoSchema.remove('dob');
saccoSchema.remove('gender');


module.exports = mongoose.model('Sacco', saccoSchema);
