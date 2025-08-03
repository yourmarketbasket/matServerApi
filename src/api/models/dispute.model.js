const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
  payrollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payroll',
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the dispute'],
  },
  status: {
    type: String,
    enum: ['open', 'escalated', 'resolved'],
    default: 'open',
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Ensure that either ticketId or payrollId is provided, but not both.
DisputeSchema.pre('validate', function(next) {
  if (!this.ticketId && !this.payrollId) {
    next(new Error('Dispute must be linked to either a ticket or a payroll.'));
  } else if (this.ticketId && this.payrollId) {
    next(new Error('Dispute cannot be linked to both a ticket and a payroll.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
