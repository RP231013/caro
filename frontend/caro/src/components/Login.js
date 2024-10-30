import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import WelcomeBar from './WelcomeBar';
import axios from 'axios';

function Login() {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });
  
      // Store token and user information
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
  
      // Redirect based on user type
      if (response.data.user.userType === 'driver') {
        navigate('/driver-dashboard'); // Redirect to driver dashboard
      } else if (response.data.user.userType === 'owner') {
        navigate('/owner-dashboard'); // Redirect to owner dashboard
      }
    } catch (error) {
      console.error('Error during login:', error.response.data.message);
      // You can set up an alert or error message here
    }
  };

  const switchToSignUp = () => setView('signup');

  if (view === 'signup') {
    navigate('/signup');
  }

  return (
    <>
      <WelcomeBar />
      <Container className="login-container mt-5 p-4 rounded shadow">
        <h2 className="mb-4">Let’s get you back in</h2>
        <ToggleButtonGroup
          type="radio"
          name="view"
          value={view}
          onChange={switchToSignUp}
          className="mb-4"
        >
          <ToggleButton id="tbg-radio-login" variant="outline-primary" value="login">
            Login
          </ToggleButton>
          <ToggleButton id="tbg-radio-signup" variant="outline-primary" value="signup">
            Sign Up
          </ToggleButton>
        </ToggleButtonGroup>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mt-3">
            Login
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default Login;
