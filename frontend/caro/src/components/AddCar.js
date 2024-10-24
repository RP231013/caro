import React, { useState } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';

function AddCar() {
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    transmission: '',
    pricePerDay: '',
    mileage: '',
    registrationNumber: '',
  });

  const [location, setLocation] = useState(null);

  // Handle car details input change
  const handleChange = (e) => {
    setCarDetails({ ...carDetails, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API request to add a car
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/cars/add',
        { ...carDetails, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Car added successfully:', response.data);
      // Reset form fields and location
      setCarDetails({
        make: '',
        model: '',
        transmission: '',
        pricePerDay: '',
        mileage: '',
        registrationNumber: '',
      });
      setLocation(null);
    } catch (error) {
      console.error('Error adding car:', error.response.data.message);
    }
  };

  // Leaflet Map component for selecting a car location
  function LocationSelector() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng); // Set location state when the user clicks on the map
      },
    });

    return location === null ? null : (
      <Marker position={location} />
    );
  }

  return (
    <Container className="add-car-container mt-4 p-4 rounded shadow">
      <h2 className="mb-4">Add a New Car</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Make:</Form.Label>
              <Form.Control
                type="text"
                name="make"
                value={carDetails.make}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Model:</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={carDetails.model}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Transmission:</Form.Label>
              <Form.Control
                type="text"
                name="transmission"
                value={carDetails.transmission}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Price/Day (in Rands):</Form.Label>
              <Form.Control
                type="number"
                name="pricePerDay"
                value={carDetails.pricePerDay}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Mileage:</Form.Label>
              <Form.Control
                type="number"
                name="mileage"
                value={carDetails.mileage}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Registration Number:</Form.Label>
              <Form.Control
                type="text"
                name="registrationNumber"
                value={carDetails.registrationNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h5>Select Car Location on the Map:</h5>
        <MapContainer
          center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
          zoom={13}
          style={{ height: '300px', width: '100%', marginBottom: '20px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationSelector />
        </MapContainer>

        <Button variant="primary" type="submit" className="w-100 mt-3">
          Add Car
        </Button>
      </Form>
    </Container>
  );
}

export default AddCar;