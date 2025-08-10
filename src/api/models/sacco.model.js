const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const saccoSchema = baseSchema.clone();

// Add fields specific to Saccos
saccoSchema.add({
  license: {
    type: String,
    required: [true, 'Please provide a license number'],
    unique: true,
  },
  contactPerson: {
    type: String,
    required: [true, 'Please provide a contact person'],
  },
  ntsaCompliance: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Sacco', saccoSchema);
