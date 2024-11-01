import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';

function WelcomeBar({ userType }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };

  return (
    <div className="navbar-container">
      <div className="tabs">
        {/* Logo */}
        <div className="logo">
          <span><h2>Caro</h2></span>
        </div>

        <div className="logo2">
          <span><h2>Commute with Caro.</h2></span>
        </div>

        


      </div>
    </div>
  );
}

export default WelcomeBar;
