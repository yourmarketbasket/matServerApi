const mongoose = require('mongoose');

// Sub-document schema for a stop
const StopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a stop name'],
    trim: true,
  },
  lat: {
    type: Number,
    required: [true, 'Please provide a latitude'],
  },
  lng: {
    type: Number,
    required: [true, 'Please provide a longitude'],
  },
});

const RouteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a route name'],
    trim: true,
    unique: true,
  },
  stops: {
    type: [StopSchema],
    validate: [v => Array.isArray(v) && v.length > 1, 'A route must have at least two stops'],
  },
  distance: {
    type: Number,
    required: [true, 'Please provide the route distance in kilometers'],
  },
  baseFare: {
    type: Number,
    required: [true, 'Please provide a base fare'],
  },
  fareAdjustments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FareAdjustment',
  }],
  status: {
    type: String,
    enum: ['draft', 'finalized', 'locked'],
    default: 'draft',
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Route', RouteSchema);
