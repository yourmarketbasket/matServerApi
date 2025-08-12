const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    // Mongoose 6+ no longer needs useNewUrlParser, useUnifiedTopology, etc.
    // Set autoIndex to false to prevent Mongoose from creating collections on startup.
    const conn = await mongoose.connect(config.mongodbUri, { autoIndex: false });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
