const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Route to fetch user info based on JWT
router.get('/me', async (req, res) => {
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Route to update user info
router.put('/update', async (req, res) => {
  const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Update the user fields based on the request body
    const updatedData = {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      idNumber: req.body.idNumber,
      licenseNumber: req.body.licenseNumber,
    };

    // Find the user by ID and update their data
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('-password'); // Exclude password in the response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
