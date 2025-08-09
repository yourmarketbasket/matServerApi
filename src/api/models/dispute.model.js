const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the ticket'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the dispute'],
  },
  category: {
    type: String,
    enum: ['cancellation', 'reallocation', 'system_error', 'payment', 'general_inquiry'],
    required: [true, 'Please specify a category for the ticket'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'escalated', 'resolved', 'closed'],
    default: 'open',
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
  payrollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payroll',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
  resolutionDetails: {
      type: String,
  }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
