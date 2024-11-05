# Caro - Car Sharing Platform

![intro](/mockups/intro.jpg)

[→ Watch the demo video here ←](https://drive.google.com/drive/folders/1hHSTWs-eO0on5pKrc-qode9RuWAhlF7t?usp=sharing)

## Overview

Caro is a car-sharing platform aimed at helping commuters who have a driver’s license but cannot afford a car. The platform allows users to rent vehicles from private owners, facilitating an easy, affordable, and accessible way for everyone to access personal transportation. It works by having a _driver-user_ choose their location on a map to find a car, after having found a suitable car, they can rent it and a NFC key will be sent to their phone to unlock and use the car with.

## Table of Contents
- [Mockups](#mockups)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [ERD](#ERD)
- [Contributing](#contributing)
- [License](#license)

## Mockups
![mockups](/mockups/mockups.jpg)

## Features

- User Authentication: Register and login for both car owners and drivers with secure authentication.
- Real-time Location Selection: Users can select pick-up and drop-off points on a map.
- Booking Management: Users can view, manage, and edit current and past bookings.
- Map Integration: Integration with Leaflet for real-time car locations.
- Interactive Dashboard: Users can view available cars nearby, their own bookings, and profile details.
- Role-specific Navigation: Different functionalities for drivers and owners, with tailored dashboards.

## Tech stack
### Frontend:

- React
- React Bootstrap
- Leaflet for map integration

### Backend:

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started
To run this project locally, ensure you have the following prerequisites installed:

- Node.js 
- MongoDB: For local development, install MongoDB or use MongoDB Atlas.


### Installation


1. **Clone the repository**
```
git clone https://github.com/RP231013/caro
cd caro 
```

2. **Set up the backend**
```
cd backend
npm install
```

3. **Set up the frontend**
```
cd frontend
npm install
```

4. **Configure environment variables:**
Create a .env file in the backend directory and add the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. **Start the development servers**
```
cd backend
npm start
```

```
cd ../frontend
npm start
```

6. **Open your browser**
Navigate to `http://localhost:3000` to use the application.

## Usage
#### Roles and Functionalities

- Drivers: Register, login, and search for cars nearby, view bookings, and make car reservations.
- Owners: Register, login, and add cars, set location, mileage, pricing, and availability.

#### Testing the Features

- Driver Actions: Explore nearby cars, make bookings, and view booking history.
- Owner Actions: Add new cars, update car availability, and manage car details.

#### Map Interactions

Select start and destination points on the map for bookings. Real-time markers show available cars based on location


## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Registers a new user. 
Request Body: { name, surname, email, password, idNumber, licenseNumber, userType }
Response: Returns a JSON Web Token (JWT) for authenticated access and basic user information.
- `POST /api/auth/login` - Authenticates a user and issues a JWT.
Request Body: { email, password }
Response: Returns a JWT and user information if credentials are valid
- `GET /api/auth/me` - Retrieves the authenticated user’s details based on the provided JWT.
Headers: `Authorization:` Bearer `<token>`
Response: Returns user details excluding the password.


### User Routes

- `POST /api/petlisting/upload` - Fetches the logged-in user’s profile information.
Headers: `Authorization`: Bearer `<token>`
Response: Returns user profile details.
- `PUT /api/users/update` - Updates the user profile information.
Headers: `Authorization`: Bearer `<token>`
Request Body: `{ name, surname, email, idNumber, licenseNumber }`
Response: Returns updated user details.

### Car Routes
- `POST /api/cars/add` - Adds a new car for the owner.
Headers: `Authorization`: Bearer `<token>`
Request Body: `{ make, model, transmission, pricePerDay, mileage, registrationNumber, location }`
Response: Returns details of the newly added car.
- `GET /api/cars` -Retrieves all cars associated with the authenticated owner.
Headers: `Authorization`: Bearer `<token>`
Response: Returns a list of cars for the owner.
- `GET /api/cars/nearby` -Retrieves cars available for rent near a specified location within a defined radius.
Headers: `Authorization`: Bearer `<token>`
Query Parameters: latitude, longitude
Response: Returns a list of nearby available cars
Headers: `Authorization`: Bearer `<token>`
Response: Returns a list of cars for the owner.
- `PUT /api/cars/:id` - Updates car details for a specific car.
Headers: `Authorization:` Bearer `<token>`
Request Body: { make, model, transmission, pricePerDay, mileage, registrationNumber, location }
Response: Returns updated car information
Headers: `Authorization`: Bearer `<token>`
Response: Returns a list of cars for the owner.
- `DELETE /api/cars/:id` - Deletes a car by ID.
Headers: `Authorization`: Bearer `<token>`
Response: Returns confirmation of the deletion.

## ERD
![ERD](/mockups/ERD.png)


## Contributing

1. Fork the repository
2. Create a new branch for your feature (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits
- Car illustrations form [Figma](https://www.figma.com/community/file/1076169841194336782)
- Select CSS UI elements from [uiverse.io](https://uiverse.io/)