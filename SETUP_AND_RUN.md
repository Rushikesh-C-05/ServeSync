# Frontend-Backend Connection Setup Guide

## Overview

This guide explains how to run both Frontend and Backend together.

## Prerequisites

- **Node.js** (v18+) - for Frontend
- **Java 21** - for Backend
- **MongoDB** - for Database
- **Maven** - for Backend build tool

## Backend Setup & Running

### 1. Ensure MongoDB is Running

```bash
# Windows (if installed locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update the connection string in: Backend/src/main/resources/application.properties
```

### 2. Build Backend

```bash
cd Backend
mvn clean install
```

### 3. Run Backend

```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using Java (after build)
java -jar target/servesync-backend-1.0.0.jar
```

Backend will be available at: **http://localhost:8080**

## Frontend Setup & Running

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Run Frontend Development Server

```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000** or **http://localhost:5173**

## API Connection

The frontend is configured to connect to the backend at: **http://localhost:8080/api**

This is set in:

- `.env` files in the Frontend directory
- Environment variable: `VITE_API_BASE_URL`

## Running Both Together

### Step-by-step:

1. **Start MongoDB** (if using local)

   ```bash
   mongod
   ```

2. **Start Backend** (in one terminal)

   ```bash
   cd Backend
   mvn spring-boot:run
   ```

   Wait for: "Started ServeSyncApplication in X seconds"

3. **Start Frontend** (in another terminal)

   ```bash
   cd Frontend
   npm run dev
   ```

   Wait for: "Local: http://localhost:3000" or "http://localhost:5173"

4. **Access the Application**
   - Open browser to: **http://localhost:3000** (or 5173)
   - You should see the landing page

## Test Login Credentials

### Customer/User

- Email: `user@servesync.com`
- Password: `password`

### Service Provider

- Email: `provider@servesync.com`
- Password: `password`

### Administrator

- Email: `admin@servesync.com`
- Password: `password`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/provider` - Provider login
- `POST /api/auth/login/admin` - Admin login

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `POST /api/user/bookings` - Create booking
- `GET /api/user/:userId/bookings` - Get user bookings

### Provider

- `GET /api/provider/:providerId/bookings` - Get booking requests
- `POST /api/provider/bookings/:bookingId/accept` - Accept booking
- `GET /api/provider/:providerId/earnings` - Get provider earnings

### Admin

- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/providers` - All providers

## Environment Variables

### Frontend (.env file)

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend (application.properties)

```
server.port=8080
spring.data.mongodb.uri=mongodb://localhost:27017/servesync
```

## Troubleshooting

### "Connection refused" error

- **Backend not running?** Make sure `mvn spring-boot:run` is executed
- **MongoDB not running?** Start MongoDB service
- **Wrong port?** Verify Backend is on 8080 and Frontend knows the correct API URL

### CORS errors

- CORS is already configured in `Backend/src/main/java/com/servesync/config/CorsConfig.java`
- Allowed origins: `http://localhost:3000`, `http://localhost:5173`

### Login not working

- Check browser console for errors
- Verify Backend is returning user data correctly
- Check that `application.properties` has correct MongoDB URI

### Build errors

- Clear cache: `mvn clean`
- Update dependencies: `mvn clean install`
- For Frontend: `rm -rf node_modules` then `npm install`

## Production Build

### Frontend

```bash
cd Frontend
npm run build
# Output will be in dist/ folder
```

### Backend

```bash
cd Backend
mvn clean package
# JAR will be in target/ folder
```

## Project Structure

```
ServerSync/
├── Backend/          # Spring Boot API Server
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/servesync/
│           │   ├── controller/
│           │   ├── service/
│           │   ├── model/
│           │   ├── repository/
│           │   └── config/
│           └── resources/
│               └── application.properties
│
└── Frontend/         # React Vite Application
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── pages/
        ├── components/
        ├── services/  (API integration here)
        ├── context/   (Auth context)
        └── App.jsx
```

## Notes

- The Frontend uses **Axios** for HTTP requests
- All API calls are intercepted with auth token
- Frontend auto-redirects to login if token expires (401)
- Database uses **MongoDB** (local or Atlas)
- Backend implements **CORS** for cross-origin requests
