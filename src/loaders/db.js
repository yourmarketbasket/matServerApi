const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    // Mongoose 6+ no longer needs useNewUrlParser, useUnifiedTopology, etc.
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
