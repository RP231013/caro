import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import axios from 'axios';
import './DriverDashboard.css';

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

  const handleFindCars = async () => {
    if (!startLocation || !destinationLocation || !startDate || !endDate) {
      alert('Please fill in all the details and select both locations');
      return;
    }
  
    // Store the selected locations and dates
    localStorage.setItem('startLocation', JSON.stringify(startLocation));
    localStorage.setItem('destinationLocation', JSON.stringify(destinationLocation));
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/cars/nearby', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          latitude: startLocation.lat,
          longitude: startLocation.lng,
        },
      });
  
      // Check if there are nearby cars
      if (response.data.cars.length === 0) {
        alert("Sorry! There are currently no cars near you.");
        navigate('/driver-dashboard');
      } else {
        navigate('/nearby-cars');
      }
    } catch (error) {
      console.error('Error checking for nearby cars:', error);
      alert('Could not check for nearby cars. Please try again.');
    }
  };
  

  return (
    <>
      <NavBar userType="driver" />
      <Container className="mt-4">
        <h2 className="mb-4">Make a Booking</h2>
        <Row>
          <Col md={8}>
            <div className="marker-selection mt-3">
              <Button
                variant={isStartMarkerSelected ? "primary" : "outline-primary"}
                onClick={() => setIsStartMarkerSelected(true)}
                className="me-2"
              >
                Select Start Location
              </Button>
              <Button
                variant={!isStartMarkerSelected ? "primary" : "outline-primary"}
                onClick={() => setIsStartMarkerSelected(false)}
              >
                Select Destination
              </Button>
            </div>
            <MapContainer
              center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
              zoom={13}
              style={{ height: '400px', width: '100%' }}
              className="map-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationSelector />
            </MapContainer>
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
