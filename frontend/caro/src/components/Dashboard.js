import React from 'react';
import { Container } from 'react-bootstrap';
import NavBar from './NavBar';

function Dashboard({ userType }) {
  return (
    <>
      <NavBar userType={userType} />
      <Container className="dashboard-container mt-4">
        <h2>Welcome, {userType === 'driver' ? 'Driver' : 'Owner'}!</h2>
        {/* Conditional content can be rendered here based on user type */}
        {userType === 'driver' ? (
          <p>Here are your options for booking a car...</p>
        ) : (
          <p>Manage your cars or add new ones below...</p>
        )}
      </Container>
    </>
  );
}

export default Dashboard;
