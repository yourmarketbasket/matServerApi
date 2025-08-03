const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: [true, 'Please provide a license plate'],
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide the vehicle capacity'],
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    // A vehicle might not be assigned to a route initially
  },
  saccoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User with 'owner' role
    required: true,
  },
  condition: {
    type: String,
    required: [true, 'Please provide the vehicle condition'],
  },
  class: {
    type: String,
    enum: ['economy', 'business', 'first_class'],
    required: [true, 'Please specify the vehicle class'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
