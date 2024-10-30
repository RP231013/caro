const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const router = express.Router();

// Create a booking route
router.post('/create', async (req, res) => {
  const { carID, startDate, endDate } = req.body;
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const driverID = decoded.id;

    // Check if the car is available
    const car = await Car.findById(carID);
    if (!car || car.rented) {
      return res.status(400).json({ message: 'Car is already rented or not available' });
    }

    // Create a new booking
    const newBooking = new Booking({
      bookingID: `BOOK-${Date.now()}`, // Generate a unique booking ID based on the timestamp
      driverID,
      carID,
      startDate,
      endDate,
      activeBooking: true,
    });

    // Save the booking
    await newBooking.save();

    // Update the car's rented status and rentedBy field
    car.rented = true;
    car.rentedBy = driverID;
    await car.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get bookings for a specific driver
router.get('/driver', async (req, res) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find bookings for the authenticated driver
      const bookings = await Booking.find({ driverID: decoded.id }).populate('carID');
      
      if (!bookings.length) {
        return res.status(404).json({ message: 'No bookings found' });
      }
  
      res.json({ bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/return', async (req, res) => {
    const { bookingId, newLocation, newMileage } = req.body;
  
    try {
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Find the car and update details
      const car = await Car.findById(booking.carID);
      if (!car) {
        return res.status(404).json({ message: 'Car not found' });
      }
  
      car.location = JSON.stringify(newLocation);
      car.mileage = newMileage;
      car.rented = false;
      car.rentedBy = null;
  
      await car.save();
  
      // Update the booking status
      booking.activeBooking = false;
      await booking.save();
  
      res.status(200).json({ message: 'Car returned successfully' });
    } catch (error) {
      console.error('Error returning car:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
