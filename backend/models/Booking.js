const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingID: {
    type: String,
    required: true,
    unique: true,
  },
  driverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  carID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  activeBooking: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, 
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
