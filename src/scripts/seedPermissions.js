const mongoose = require('mongoose');
const connectDB = require('../loaders/db');
const Permission = require('../api/models/permission.model');
const { permissionsData } = require('../config/permissions');

const seedPermissions = async () => {
  try {
    // Connect to DB and wait for the connection to be established
    await connectDB();

    // Clear existing permissions
    await Permission.deleteMany({});
    console.log('Permissions cleared.');

    // Insert new permissions
    await Permission.insertMany(permissionsData.permissions);
    console.log('Permissions have been seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding permissions:', error);
    process.exit(1);
  }
};

seedPermissions();
