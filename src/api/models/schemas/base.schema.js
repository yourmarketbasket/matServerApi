const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const baseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['Driver', 'Passenger', 'Sacco', 'QueueManager', 'Owner', 'Superuser'],
    required: true,
  },
  permissions: {
    type: [String],
    default: [],
  },
  address: {
    fullAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  device_details: {
    type: Object,
  },
  payment_account: {
    type: Object,
  },
  rating: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
  },
  approvedStatus: {
    type: String,
    enum: ['pending', 'approved', 'suspended', 'blocked'],
    default: 'pending',
  },
  verified: {
    type: {
      email: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
    },
    default: { email: false, phone: false },
  },
  mfaSecret: {
    type: String,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpire: Date,
  tokenValidAfter: Date,
}, { timestamps: true }); // Using timestamps option for createdAt and updatedAt

// Encrypt password using bcrypt before saving
baseSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password to hashed password in database
baseSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
baseSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = baseSchema;
