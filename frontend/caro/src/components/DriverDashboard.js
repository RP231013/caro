import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

function DriverDashboard() {
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartMarkerSelected, setIsStartMarkerSelected] = useState(true);
  const navigate = useNavigate();

  // Custom map component for selecting two locations (start and destination)
  function LocationSelector() {
    useMapEvents({
      click(e) {
        if (isStartMarkerSelected) {
          setStartLocation(e.latlng);
        } else {
          setDestinationLocation(e.latlng);
        }
      },
    });

    return (
      <>
        {startLocation && <Marker position={startLocation} />}
        {destinationLocation && <Marker position={destinationLocation} />}
      </>
    );
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
    navigate('/nearby-cars');
  };

  return (
    <>
      <NavBar userType="driver" />
      <Container className="mt-4">
        <h2 className="mb-4">Find Nearby Cars</h2>
        <Row>
          <Col md={8}>
            <MapContainer
              center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationSelector />
            </MapContainer>
            <div className="marker-selection mt-3">
              <Button
                variant={isStartMarkerSelected ? "success" : "outline-success"}
                onClick={() => setIsStartMarkerSelected(true)}
                className="me-2"
              >
                Select Start Location
              </Button>
              <Button
                variant={!isStartMarkerSelected ? "success" : "outline-success"}
                onClick={() => setIsStartMarkerSelected(false)}
              >
                Select Destination
              </Button>
            </div>
          </Col>

          <Col md={4}>
            <Form>
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
