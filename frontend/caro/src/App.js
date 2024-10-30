import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import AddCar from './components/AddCar';
import OwnerDashboard from './components/OwnerDashboard';
import DriverDashboard from './components/DriverDashboard';
import NearbyCars from './components/NearbyCars';

function App() {
  const [userType, setUserType] = useState(null); // State to store user type
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to check if user is authenticated

  useEffect(() => {
    // Check for stored user info and token on app load
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUserType(storedUser.userType);
      setIsAuthenticated(true);
    }
  }, []);

  // Define routes based on the authenticated user and userType
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/nearby-cars" element={<NearbyCars />} /> {/* Ensure this is defined */}

        {/* Protected Routes */}
        {isAuthenticated && userType && (
          <>
            <Route path="/dashboard" element={<Dashboard userType={userType} />} />
            {userType === 'owner' && (
              <>
                <Route path="/add-car" element={<AddCar />} />
                <Route path="/cars" element={<OwnerDashboard />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
