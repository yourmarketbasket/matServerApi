const mongoose = require('mongoose');

const LoyaltyTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['earned', 'redeemed'],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    // Required for 'earned' type, optional for 'redeemed' if points are used for other rewards
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String, // e.g., "Points earned from trip XYZ" or "Redeemed for 50 KES discount"
  },
});

const LoyaltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One loyalty account per user
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  transactions: [LoyaltyTransactionSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updatedAt' field on every save
LoyaltySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Loyalty', LoyaltySchema);
