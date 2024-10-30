import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
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
  iconSize: [45, 60], // size of the icon
});

// Define a custom green marker icon for the user's location
const greenIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2536/2536745.png',
  iconSize: [45, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

function NearbyCars() {
  const [cars, setCars] = useState([]);
  const startLocation = JSON.parse(localStorage.getItem('startLocation'));
  const navigate = useNavigate();

  // Function to calculate the number of rental days
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    let rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert time difference from milliseconds to days
    if (rentalDays === 0) {
      rentalDays = 1; // Ensure at least one rental day
    }
    return rentalDays;
  };

  const fetchNearbyCars = async () => {
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

      setCars(response.data.cars);
    } catch (error) {
      console.error('Error fetching nearby cars:', error);
    }
  };

  const handleRentCar = async (carID) => {
    try {
      const token = localStorage.getItem('token');
      const startDate = localStorage.getItem('startDate');
      const endDate = localStorage.getItem('endDate');
      const response = await axios.post(
        'http://localhost:5001/api/bookings/create',
        { carID, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Booking successful! Booking ID: ${response.data.booking.bookingID}`);
      navigate('/driver-bookings');
    } catch (error) {
      console.error('Error renting car:', error);
      alert('Error renting car. Please try again.');
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
              center={startLocation ? [startLocation.lat, startLocation.lng] : [-26.2041, 28.0473]} // Default center to startLocation or fallback to Johannesburg
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
                <Marker key={car.carID} position={JSON.parse(car.location)}>
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
              {cars.map((car) => {
                const startDate = localStorage.getItem('startDate');
                const endDate = localStorage.getItem('endDate');
                const rentalDays = calculateDays(startDate, endDate);
                const totalCost = rentalDays * car.pricePerDay;

                return (
                  <Card key={car.carID} className="mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title>{car.make} {car.model}</Card.Title>
                      <Card.Text>
                        Transmission: {car.transmission} <br />
                        Price/Day: R{car.pricePerDay} <br />
                        Mileage: {car.mileage} km <br />
                        Registration: {car.registrationNumber} <br />
                        <strong>Total Price: R{totalCost}</strong>
                      </Card.Text>
                      <Button variant="primary" size="sm" onClick={() => handleRentCar(car._id)}>
                        Rent Now
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default NearbyCars;
