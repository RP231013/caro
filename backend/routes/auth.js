const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Owner = require('../models/Owner');
const Car = require('../models/Car');
const router = express.Router();

// Sign-Up Route
router.post('/signup', async (req, res) => {
  const { name, surname, email, password, idNumber, licenseNumber, userType } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user based on user type
    let newUser;
    if (userType === 'driver') {
      newUser = new Driver({
        name,
        surname,
        email,
        password: hashedPassword,
        idNumber,
        licenseNumber,
        userType,
      });
    } else if (userType === 'owner') {
      newUser = new Owner({
        name,
        surname,
        email,
        password: hashedPassword,
        idNumber,
        licenseNumber,
        userType,
        cars: [], // Initialize empty cars array for owners
      });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Save user and respond with JWT token
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, userType: newUser.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: newUser._id, name, email, userType } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Respond with JWT token
    const token = jwt.sign({ id: existingUser._id, userType: existingUser.userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: existingUser._id, name: existingUser.name, email, userType: existingUser.userType } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
