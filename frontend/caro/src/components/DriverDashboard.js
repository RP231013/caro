import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

function DriverDashboard() {
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [startDate, setStartDate] = useState(''); // Declare startDate state
  const [endDate, setEndDate] = useState(''); // Declare endDate state
  const navigate = useNavigate();

  // Custom map component for selecting a location
  function LocationSelector({ location, setLocation }) {
    useMapEvents({
      click(e) {
        setLocation(e.latlng); // Set location state when the user clicks on the map
      },
    });

    return location === null ? null : <Marker position={location} />;
  }

  // Handle form submission to find nearby cars
  const handleFindCars = () => {
    if (!startLocation || !destinationLocation || !startDate || !endDate) {
      alert('Please fill in all the details and select both locations');
      return;
    }

    // Store the selected locations and dates (can be stored in local storage or context API)
    localStorage.setItem('startLocation', JSON.stringify(startLocation));
    localStorage.setItem('destinationLocation', JSON.stringify(destinationLocation));
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);

    // Navigate to the page with nearby cars
    navigate('/nearby-cars'); // Ensure this path matches the route defined in App.js
  };

  return (
    <>
      <NavBar userType="driver" />
      <Container className="mt-4">
        <h2 className="mb-4">Make a Booking</h2>
        <Row>
          <Col md={6}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Where are you?</Form.Label>
                <MapContainer
                  center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationSelector location={startLocation} setLocation={setStartLocation} />
                </MapContainer>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Where are you going?</Form.Label>
                <MapContainer
                  center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationSelector location={destinationLocation} setLocation={setDestinationLocation} />
                </MapContainer>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" className="w-100 mt-3" onClick={handleFindCars}>
                Find Cars
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DriverDashboard;
