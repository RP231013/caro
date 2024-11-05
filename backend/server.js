const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const usersRoute = require('./routes/users');
const bookingsRoute = require('./routes/bookings');

dotenv.config();

const app = express();
const path = require('path');


// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../frontend/caro/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/caro/build', 'index.html'));
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: 'https://carocommute-d1ab102e1269.herokuapp.com', 
  credentials: true,
}));