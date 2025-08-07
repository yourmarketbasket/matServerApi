const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Expires in 600 seconds (10 minutes)
  },
});

// Hash OTP before saving
OTPSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
  next();
});

module.exports = mongoose.model('OTP', OTPSchema);
