import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import NavBar from './NavBar';
import axios from 'axios';
import { FaUser, FaCar } from 'react-icons/fa';

function OwnerAccount() {
  const [userInfo, setUserInfo] = useState({});
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Fetch user info from API
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:5001/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(userResponse.data);

        // Fetch owner's cars
        const carsResponse = await axios.get('http://localhost:5001/api/cars', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCars(carsResponse.data.cars);
      } catch (error) {
        console.error('Error fetching user info or cars:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      <NavBar userType="owner" />
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
                  <FaCar size={50} className="me-3" />
                  <div>
                    <Card.Title>Your Cars</Card.Title>
                    {cars.length > 0 ? (
                      cars.map((car) => (
                        <Card.Text key={car.carID}>
                          {car.make} {car.model} - R{car.pricePerDay}/day
                        </Card.Text>
                      ))
                    ) : (
                      <Card.Text>No cars listed</Card.Text>
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

export default OwnerAccount;
