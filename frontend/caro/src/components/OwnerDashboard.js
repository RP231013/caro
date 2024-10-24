import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import NavBar from './NavBar';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function OwnerDashboard() {
  const [cars, setCars] = useState([]);
  
  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/cars', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCars(response.data.cars); // Assuming your backend returns an array of cars
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <>
      <NavBar userType="owner" />
      <Container className="mt-4">
        <h2 className="mb-4">My Cars</h2>
        <Row>
          {/* Map Section */}
          <Col md={6}>
            <MapContainer
              center={[-26.2041, 28.0473]} // Default center (Johannesburg, South Africa)
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {cars.map((car) => (
                <Marker
                  key={car.carID}
                  position={JSON.parse(car.location)} // Assuming car.location is stored as a JSON string
                >
                  <Popup>
                    <strong>{car.make} {car.model}</strong> <br />
                    R{car.pricePerDay}/day <br />
                    Mileage: {car.mileage} km
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Col>

          {/* Car List Section */}
          <Col md={6}>
            <div className="car-list">
              {cars.map((car) => (
                <Card key={car.carID} className="mb-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>{car.make} {car.model}</Card.Title>
                    <Card.Text>
                      Transmission: {car.transmission} <br />
                      Price/Day: R{car.pricePerDay} <br />
                      Mileage: {car.mileage} km <br />
                      Registration: {car.registrationNumber}
                    </Card.Text>
                    <Button variant="primary" size="sm">View</Button>
                    <Button variant="danger" size="sm" className="ms-2">Delete</Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default OwnerDashboard;
