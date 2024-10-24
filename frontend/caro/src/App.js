import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';

function App() {
  // Placeholder state for the user type (replace with your authentication logic)
  const [userType, setUserType] = useState('driver'); // Change to 'owner' for testing

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard userType={userType} />} />
        {/* Add additional routes for Bookings, Account, Cars, Add Car, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
