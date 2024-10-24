const User = require('./User');
const mongoose = require('mongoose');
const Car = require('./Car');

// Define the Owner schema (extend User schema)
const ownerSchema = new mongoose.Schema({
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
});

// Create an Owner model using User as the base schema
const Owner = User.discriminator('owner', ownerSchema);
module.exports = Owner;
