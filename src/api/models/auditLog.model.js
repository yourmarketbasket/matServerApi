const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Auth Actions
      'login', 'signup', 'superuser_registered',
      // Superuser Actions
      'staff_created', 'staff_updated', 'staff_deleted', 'fare_policy_set', 'system_fee_set', 'loyalty_policy_set',
      // Sacco Actions
      'sacco_created', 'sacco_approved', 'sacco_rejected', 'sacco_updated',
      // Route Actions
      'route_created', 'route_updated', 'route_finalized', 'fare_adjusted',
      // Vehicle Actions
      'vehicle_created', 'vehicle_updated', 'vehicle_deleted',
      // Discount Actions
      'discount_created', 'discount_applied', 'discount_deleted',
      // Trip Actions
      'trip_registered', 'trip_canceled', 'trip_completed',
      // Other major actions can be added here
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Allows for flexible object structure
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for faster queries on user actions or specific actions
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
