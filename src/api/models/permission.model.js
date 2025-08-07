const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  permissionNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
  },
  modulePage: {
    type: String,
  },
  httpMethod: {
    type: String,
  },
  constraints: {
    type: String,
  },
});

module.exports = mongoose.model('Permission', PermissionSchema);
