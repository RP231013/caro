import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import NavBar from './NavBar';
import axios from 'axios';
import { FaUser, FaCar, FaCalendarAlt } from 'react-icons/fa';

function DriverAccount() {
  const [userInfo, setUserInfo] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch user info from API
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);

        // Fetch driver-specific bookings if needed
        const bookingsResponse = await axios.get('http://localhost:5001/api/bookings/driver', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(bookingsResponse.data.bookings);
      } catch (error) {
        console.error('Error fetching user info or bookings:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <NavBar userType="driver" />
      <Container className="mt-4">
        <h2 className="mb-4">Your Profile</h2>
        <Row>
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaUser size={50} className="me-3" />
                  <div>
                    <Card.Title>{userInfo.name} {userInfo.surname}</Card.Title>
                    <Card.Text>Email: {userInfo.email}</Card.Text>
                    <Card.Text>ID Number: {userInfo.idNumber}</Card.Text>
                    <Card.Text>License Number: {userInfo.licenseNumber}</Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <FaCalendarAlt size={50} className="me-3" />
                  <div>
                    <Card.Title>Recent Bookings</Card.Title>
                    {bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <Card.Text key={booking.id}>
                          {booking.carModel} - {new Date(booking.date).toLocaleDateString()}
                        </Card.Text>
                      ))
                    ) : (
                      <Card.Text>No recent bookings</Card.Text>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Button variant="primary">Edit Profile</Button>
      </Container>
    </>
  );
}

export default DriverAccount;
