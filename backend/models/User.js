const mongoose = require('mongoose');

// Define the common User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  idNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  userType: { type: String, enum: ['driver', 'owner'], required: true },
}, {
  discriminatorKey: 'userType',
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
