const mongoose = require('mongoose');

const HttpRequestLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  ipAddress: {
    type: String,
  },
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  requestPayload: {
    type: mongoose.Schema.Types.Mixed,
  },
  responsePayload: {
    type: mongoose.Schema.Types.Mixed,
  },
  statusCode: {
    type: Number,
    required: true,
    index: true,
  },
  isSuccess: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  processingTime: {
    type: Number, // in milliseconds
  },
});

module.exports = mongoose.model('HttpRequestLog', HttpRequestLogSchema);
