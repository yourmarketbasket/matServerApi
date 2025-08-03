const mongoose = require('mongoose');

const SaccoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a Sacco name'],
    trim: true,
    unique: true,
  },
  license: {
    type: String,
    required: [true, 'Please provide a license number'],
    unique: true,
  },
  contact: {
    type: String,
    required: [true, 'Please provide a contact person'],
  },
  ntsaCompliance: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the support staff who created the Sacco
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Sacco', SaccoSchema);
