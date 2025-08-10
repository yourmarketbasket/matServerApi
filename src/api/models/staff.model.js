const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');

// Clone the base schema to avoid modifying the original
const staffSchema = baseSchema.clone();

// Add fields specific to the Staff model
staffSchema.add({
  role: {
    type: String,
    enum: ['support_staff', 'admin', 'superuser', 'ordinary'],
    default: 'ordinary',
    required: true,
  },
  rank: {
    type: String,
    enum: [
      'CEO',
      'CFO',
      'COO',
      'CTO',
      'VP',
      'Director',
      'Manager',
      'Supervisor',
      'Team Lead',
      'Staff',
      'Intern',
      'Ordinary',
    ],
    default: 'Ordinary',
  },
});

module.exports = mongoose.model('Staff', staffSchema);
