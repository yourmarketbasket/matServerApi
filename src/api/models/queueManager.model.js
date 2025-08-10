const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema
const queueManagerSchema = baseSchema.clone();

// Add any fields specific to QueueManagers here if needed in the future

module.exports = mongoose.model('QueueManager', queueManagerSchema);
