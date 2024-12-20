const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carID: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  transmission: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  mileage: { type: Number, required: true },
  registrationNumber: { type: String, required: true },
  location: { type: String, required: true },
  rented: { type: Boolean, default: false }, 
  rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
}, {
  timestamps: true,
});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
