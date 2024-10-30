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

// Route to get cars for the logged-in owner
router.get('/', authenticate, async (req, res) => {
    try {
      const owner = await Owner.findById(req.user.id).populate('cars');
      if (!owner) {
        return res.status(404).json({ message: 'Owner not found' });
      }
  
      res.json({ cars: owner.cars });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
};

// Route to get nearby cars based on a location
router.get('/nearby', authenticate, async (req, res) => {
  const { latitude, longitude } = req.query;

  // Convert latitude and longitude to numbers
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Define the maximum distance in kilometers 
  const maxDistance = 8;

  try {
    // Fetch all cars from the database
    const cars = await Car.find({ rented: false });

    // Filter cars based on distance calculation
    const nearbyCars = cars.filter((car) => {
      // Parse the car's location from JSON
      const carLocation = JSON.parse(car.location);
      const carLat = carLocation.lat;
      const carLng = carLocation.lng;

      // Calculate the distance between the user's location and the car's location
      const distance = calculateDistance(lat, lng, carLat, carLng);
      
      // Return cars that are within the specified maximum distance
      return distance <= maxDistance;
    });

    if (!nearbyCars.length) {
      return res.status(404).json({ message: 'No cars found within the specified radius' });
    }

    res.json({ cars: nearbyCars });
  } catch (error) {
    console.error('Error fetching nearby cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
