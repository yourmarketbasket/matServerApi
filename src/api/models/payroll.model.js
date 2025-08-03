const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    unique: true, // Payroll should be generated once per trip
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true,
  },
  totalRevenue: {
    type: Number,
    required: true,
  },
  systemFee: {
    type: Number,
    required: true,
  },
  saccoFee: {
    type: Number,
    required: true,
  },
  driverCut: {
    type: Number,
    required: true,
  },
  ownerCut: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'disputed'],
    default: 'pending',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// A simple validation to ensure the cuts and fees add up
PayrollSchema.pre('save', function(next) {
    const calculatedTotal = this.systemFee + this.saccoFee + this.driverCut + this.ownerCut;
    // Using a small epsilon for floating point comparison
    if (Math.abs(this.totalRevenue - calculatedTotal) > 0.01) {
        return next(new Error('The sum of all cuts and fees must equal the total revenue.'));
    }
    next();
});

module.exports = mongoose.model('Payroll', PayrollSchema);
