import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function WelcomeBar() {
  return (
    <Navbar bg="light" variant="light" className="py-3">
      <Container>
        <Navbar.Brand href="/"><h3>Caro</h3></Navbar.Brand>
        <div className="ms-auto">
          <Navbar.Text>
            <h3>Commute with Caro.</h3>
          </Navbar.Text>
        </div>
      </Container>
    </Navbar>
  );
}

export default WelcomeBar;
