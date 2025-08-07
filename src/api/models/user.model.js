const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
    select: false, // Do not return password on query by default
  },
  role: {
    type: String,
    enum: ['passenger', 'sacco', 'owner', 'queue_manager', 'driver', 'support_staff', 'admin', 'superuser'],
    required: true,
  },
  avatar: {
    type: String,
  },
  approvedStatus: {
    type: String,
    enum: ['pending', 'approved', 'suspended', 'blocked'],
    default: 'pending',
  },
  permissions: {
    type: [String],
    default: [],
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
  passwordResetToken: String,
  passwordResetExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
// This method will be implemented later in the service layer
// UserSchema.methods.getSignedJwtToken = function () { ... }

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (e.g., 10 minutes)
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
