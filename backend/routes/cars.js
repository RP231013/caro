const express = require('express');
const Car = require('../models/Car');
const Owner = require('../models/Owner');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate the user using JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Add a car route
router.post('/add', authenticate, async (req, res) => {
  const { make, model, transmission, pricePerDay, mileage, registrationNumber, location } = req.body;

  try {
    // Create a new car
    const newCar = new Car({
      carID: `CAR-${Date.now()}`, // Simple ID generation based on timestamp
      make,
      model,
      transmission,
      pricePerDay,
      mileage,
      registrationNumber,
      location: JSON.stringify(location), // Save location as JSON string
    });

    // Save the car in the Cars collection
    await newCar.save();

    // Find the owner and add the car to their cars array
    const owner = await Owner.findById(req.user.id);
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    owner.cars.push(newCar._id);
    await owner.save();

    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
