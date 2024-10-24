import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

function Dashboard({ userType }) {
  const navigate = useNavigate();

  const handleAddCarClick = () => {
    navigate('/add-car');
  };

  return (
    <>
      <NavBar userType={userType} />
      <Container className="dashboard-container mt-4">
        <h2>Welcome, {userType === 'driver' ? 'Driver' : 'Owner'}!</h2>

        {userType === 'driver' ? (
          <>
            <Row className="mt-4">
              <Col>
                <Button variant="primary" className="w-100" onClick={() => navigate('/book')}>
                  Book a Car
                </Button>
              </Col>
              <Col>
                <Button variant="secondary" className="w-100" onClick={() => navigate('/bookings')}>
                  View My Bookings
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row className="mt-4">
              <Col>
                <Button variant="primary" className="w-100" onClick={handleAddCarClick}>
                  Add a New Car
                </Button>
              </Col>
              <Col>
                <Button variant="secondary" className="w-100" onClick={() => navigate('/cars')}>
                  View My Cars
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default Dashboard;
