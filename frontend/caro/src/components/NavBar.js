import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function NavBar({ userType }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logging out (e.g., clearing authentication tokens)
    navigate('/');
    localStorage.clear();
  };

  return (
    <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand href="/">Caro</Navbar.Brand>
        <Nav className="ms-auto">
          {userType === 'driver' ? (
            <>
              <Nav.Link href="/driver-dashboard">Book</Nav.Link>
              <Nav.Link href="/bookings">Bookings</Nav.Link>
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
      </Container>
    </Navbar>
  );
}

export default NavBar;
