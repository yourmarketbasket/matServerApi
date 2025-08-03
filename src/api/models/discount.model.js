const mongoose = require('mongoose');

const DiscountSchema = new mongoose.Schema({
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true,
  },
  code: {
    type: String,
    required: [true, 'A discount code is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: [true, 'A discount value is required'],
  },
  validUntil: {
    type: Date,
    required: [true, 'An expiry date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Sacco admin
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// A validator to check percentage value if type is percentage
DiscountSchema.path('value').validate(function(value) {
  if (this.type === 'percentage') {
    return value > 0 && value <= 100;
  }
  return true;
}, 'Percentage discount must be between 1 and 100.');

module.exports = mongoose.model('Discount', DiscountSchema);
