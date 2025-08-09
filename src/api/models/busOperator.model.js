const mongoose = require('mongoose');

const BusOperatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the bus operator'],
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['sacco', 'individual'],
    required: [true, 'Please specify the type of the bus operator'],
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  documentation: {
    type: [String],
    // In a real-world application, this would store URLs to documents on a file storage service like S3.
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BusOperator', BusOperatorSchema);
