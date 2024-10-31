import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './DriverDashboard.css';

function NavBar({ userType }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };

  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand href="/">Caro</Navbar.Brand>
        {/* Toggle button for small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* Collapsible navigation links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userType === 'driver' ? (
              <>
                <Nav.Link href="/driver-dashboard">Book</Nav.Link>
                <Nav.Link href="/driver-bookings">Bookings</Nav.Link>
                <Nav.Link href="/driver-account">Account</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/cars">Cars</Nav.Link>
                <Nav.Link href="/add-car">Add Car</Nav.Link>
                <Nav.Link href="/owner-account">Account</Nav.Link>
              </>
            )}
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
