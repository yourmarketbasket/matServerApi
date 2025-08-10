const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const passengerSchema = baseSchema.clone();

// Add any fields specific to Passengers here if needed in the future
// For now, it just uses the base schema.

module.exports = mongoose.model('Passenger', passengerSchema);
