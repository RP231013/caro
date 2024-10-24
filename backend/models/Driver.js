
const User = require('./User');
const mongoose = require('mongoose');

// Define the Driver schema (extend User schema)
const driverSchema = new mongoose.Schema({
  // Add driver-specific fields if needed in the future
});

// Create a Driver model using User as the base schema
const Driver = User.discriminator('driver', driverSchema);
module.exports = Driver;
