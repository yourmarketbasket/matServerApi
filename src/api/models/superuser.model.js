const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema to avoid modifying the original
const superuserSchema = baseSchema.clone();

// Set the role to 'superuser' and make it immutable
superuserSchema.path('role', {
  type: String,
  default: 'Superuser',
  immutable: true
});

// Set approvedStatus to 'approved' and make it immutable
superuserSchema.path('approvedStatus', {
  type: String,
  default: 'approved',
  immutable: true
});

module.exports = mongoose.model('Superuser', superuserSchema);
