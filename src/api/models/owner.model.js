const mongoose = require('mongoose');
const baseSchema = require('./schemas/base.schema');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Create a new schema by extending the base schema's definition
const ownerSchema = new mongoose.Schema({
  ...baseSchema.tree,
  idNumberOrBusinessRegNo: {
    type: String,
    required: [true, 'ID number or business registration number is required'],
    unique: true,
  },
  kraPinCertificate: {
    type: String,
    required: [true, 'KRA PIN certificate is required'],
  },
  saccoAffiliation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sacco',
  },
});

// Encrypt password using bcrypt before saving
ownerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password to hashed password in database
ownerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
ownerSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('Owner', ownerSchema);
