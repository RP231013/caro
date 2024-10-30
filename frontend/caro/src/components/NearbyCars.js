import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import NavBar from './NavBar';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdn-icons-png.flaticon.com/512/3967/3967049.png',
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3967/3967049.png',
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize:     [45, 60], // size of the icon
});

// Define a custom green marker icon for the user's location
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2536/2536745.png',
    

    iconSize:     [45, 60], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function NearbyCars() {
  const [cars, setCars] = useState([]);
  const startLocation = JSON.parse(localStorage.getItem('startLocation'));

  const fetchNearbyCars = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Fetching cars near: Latitude ${startLocation.lat}, Longitude ${startLocation.lng}`);

      const response = await axios.get('http://localhost:5001/api/cars/nearby', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          latitude: startLocation.lat,
          longitude: startLocation.lng,
        },
      });

      console.log('Cars found:', response.data.cars);
      setCars(response.data.cars);
    } catch (error) {
      console.error('Error fetching nearby cars:', error);
    }
  };

  useEffect(() => {
    fetchNearbyCars();
  }, []);

  return (
    <>
      <NavBar userType="driver" />
      <Container className="mt-4">
        <h2 className="mb-4">Cars Near You</h2>
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
              {/* Display the user's location marker in green */}
              {startLocation && (
                <Marker position={startLocation} icon={greenIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}
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
                    <Button variant="primary" size="sm">Rent Now</Button>
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

export default NearbyCars;
