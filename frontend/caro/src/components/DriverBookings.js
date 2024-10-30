// DriverBookings.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavBar from './NavBar';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';


function DriverBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/bookings/driver', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data.bookings); // Assuming the backend returns bookings with car details populated
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Calculate the number of days between two dates
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert time difference from milliseconds to days
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <NavBar userType="driver" />
<Container className="mt-4">
  <h2 className="mb-4">My Bookings</h2>
  <Row>
    {bookings.filter((booking) => booking.activeBooking === true).length > 0 ? (
      bookings
        .filter((booking) => booking.activeBooking === true) // Filter for active bookings
        .map((booking) => {
          const car = booking.carID; 
          let rentalDays = calculateDays(booking.startDate, booking.endDate);
          if (rentalDays === 0) {
            rentalDays = 1;
          }
          const totalCost = rentalDays * car.pricePerDay;

          return (
                <Col md={12} key={booking._id}>
                <Card className="mb-3 shadow-sm">
                    <Card.Body>
                    <Row>
                        <Col md={4}>
                        <img
                            src="/path/to/your/car/image" // Placeholder image path
                            alt={`${car.make} ${car.model}`}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                        </Col>
                        <Col md={8}>
                        <h3>{car.make} {car.model}</h3>
                        <p>
                            Booked dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()} <br />
                            Allowed mileage: {car.mileage ? `${car.mileage} km` : 'N/A'} <br />
                            Transmission: {car.transmission || 'N/A'} <br />
                            Price per day: R{car.pricePerDay || 'N/A'} <br />
                            Registration Number: {car.registrationNumber || 'N/A'} <br />
                            <strong>Total Price: R{totalCost}</strong>
                        </p>
                        <Button
                            variant="primary"
                            size="sm"
                            className="me-2"
                        >
                            View Key
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => navigate('/return-car', { state: { bookingId: booking._id, car } })}
                        >
                            Return
                        </Button>
                        <Button variant="danger" size="sm">Cancel</Button>
                        </Col>
                    </Row>
                    </Card.Body>
                </Card>
                </Col>
            );
            })
        ) : (
        <Col>
            <p>No active bookings found.</p>
        </Col>
        )}
    </Row>
    </Container>
    </>
  );
}

export default DriverBookings;
