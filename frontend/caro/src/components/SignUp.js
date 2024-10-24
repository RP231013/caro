import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  ToggleButton,
  ToggleButtonGroup,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import WelcomeBar from './WelcomeBar';
import axios from 'axios';

function SignUp() {
  const [view, setView] = useState('signup'); // Toggle between login and sign-up
  const [userType, setUserType] = useState('driver');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    licenseNumber: '',
    idNumber: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (val) => {
    setUserType(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/api/auth/signup', {
        ...formData,
        userType,
      });

      // Store token and user information
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on user type
      if (userType === 'driver') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error during sign-up:', error.response.data.message);
      // You can set up an alert or error message here
    }
  };

  const switchToLogin = () => setView('login');

  if (view === 'login') {
    navigate('/');
  }

  return (
    <>
      <WelcomeBar />
      <Container className="signup-container mt-5 p-4 rounded shadow">
        <h2 className="mb-4">Sign Up!</h2>

        <ToggleButtonGroup
          type="radio"
          name="view"
          value={view}
          onChange={switchToLogin}
          className="mb-4"
        >
          <ToggleButton id="tbg-radio-login" variant="outline-primary" value="login">
            Login
          </ToggleButton>
          <ToggleButton id="tbg-radio-signup" variant="outline-primary" value="signup">
            Sign Up
          </ToggleButton>
        </ToggleButtonGroup>

        <br></br>

        <ToggleButtonGroup
          type="radio"
          name="userType"
          value={userType}
          onChange={handleUserTypeChange}
          className="mb-4"
        >
          <ToggleButton id="tbg-radio-driver" variant="outline-primary" value="driver">
            Driver
          </ToggleButton>
          <ToggleButton id="tbg-radio-owner" variant="outline-primary" value="owner">
            Owner
          </ToggleButton>
        </ToggleButtonGroup>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Surname:</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>License Number:</Form.Label>
                <Form.Control
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>ID Number:</Form.Label>
                <Form.Control
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="w-100 mt-3">
            Sign Up
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default SignUp;
