const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const ownerSchema = baseSchema.clone();

// Add any fields specific to Owners here if needed in the future

module.exports = mongoose.model('Owner', ownerSchema);
