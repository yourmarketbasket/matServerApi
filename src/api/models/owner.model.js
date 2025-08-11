const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const ownerSchema = baseSchema.clone();

// Add fields specific to Owners
ownerSchema.add({
  idNumberOrBusinessRegNo: {
    type: String,
    required: [true, 'ID number or business registration number is required'],
    unique: true,
  },
  kraPinCertificate: {
    type: String,
    required: [true, 'KRA PIN certificate is required'],
  },
  saccoAffiliation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
  },
});

module.exports = mongoose.model('Owner', ownerSchema);
