# ServeSync Backend - Node.js + Express

Complete Node.js/Express.js backend for the ServeSync platform with MongoDB database.

## 🚀 Features

- **Authentication:** JWT-based auth for users, providers, and admins
- **User Management:** Profile management, bookings, reviews
- **Provider Management:** Service creation, booking management, earnings tracking
- **Admin Panel:** Platform statistics, user/provider management, payment tracking
- **Service Marketplace:** Browse, search, and filter services
- **Booking System:** Complete booking workflow with status management
- **Payment Tracking:** Platform fee calculation and provider earnings
- **Review System:** Rating and feedback for completed services
- **Image Upload:** Cloudinary-based image storage for users, providers, and services

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env` file and update values if needed
   - Default configuration:

     ```
     PORT=8080
     MONGODB_URI=mongodb://localhost:27017/servesync
     JWT_SECRET=your-secret-key-change-in-production
     JWT_EXPIRE=7d
     PLATFORM_FEE_PERCENTAGE=10

     # Cloudinary Configuration (required for image uploads)
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

3. **Seed the database:**

   ```bash
   npm run seed
   ```

4. **Start the server:**

   ```bash
   # Development (with auto-restart)
   npm run dev

   # Production
   npm start
   ```

## 📡 API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login/user` - User login
- `POST /login/provider` - Provider login
- `POST /login/admin` - Admin login

### User (`/api/user`)

- `GET /test` - Health check
- `GET /:userId/profile` - Get user profile
- `PUT /:userId/profile` - Update user profile
- `POST /:userId/bookings` - Book a service
- `GET /:userId/bookings` - Get user bookings
- `GET /:userId/bookings/:bookingId` - Get booking details
- `PATCH /:userId/bookings/:bookingId/cancel` - Cancel booking
- `POST /:userId/reviews` - Submit review
- `GET /:userId/reviews` - Get user reviews

### Provider (`/api/provider`)

- `GET /test` - Health check
- `POST /:userId/register` - Register as provider
- `GET /:userId/profile` - Get provider profile
- `POST /:userId/services` - Create service
- `GET /:userId/services` - Get provider services
- `PUT /:userId/services/:serviceId` - Update service
- `DELETE /:userId/services/:serviceId` - Delete service
- `PATCH /:userId/services/:serviceId/toggle` - Toggle availability
- `GET /:userId/bookings` - Get provider bookings
- `PATCH /:userId/bookings/:bookingId/accept` - Accept booking
- `PATCH /:userId/bookings/:bookingId/reject` - Reject booking
- `PATCH /:userId/bookings/:bookingId/complete` - Complete booking
- `GET /:userId/earnings` - Get earnings
- `GET /:userId/reviews` - Get provider reviews

### Admin (`/api/admin`)

- `GET /test` - Health check
- `GET /stats` - Get platform statistics
- `GET /users` - Get all users
- `PATCH /users/:userId/toggle-block` - Block/unblock user
- `GET /providers` - Get all providers
- `GET /providers/pending` - Get pending providers
- `PATCH /providers/:providerId/approve` - Approve provider
- `PATCH /providers/:providerId/reject` - Reject provider
- `GET /services` - Get all services
- `GET /bookings` - Get all bookings
- `GET /payments` - Get all payments
- `GET /earnings` - Get platform earnings
- `PATCH /platform-fee` - Update platform fee
- `GET /reviews` - Get all reviews

### Service (`/api/service`)

- `GET /` - Get all services
- `GET /search` - Search services (with filters)
- `GET /category/:category` - Get services by category
- `GET /:serviceId` - Get service by ID

## 🔑 Test Accounts

After seeding the database:

| Role     | Email                  | Password    |
| -------- | ---------------------- | ----------- |
| User     | user@servesync.com     | password123 |
| Provider | provider@servesync.com | password123 |
| Admin    | admin@servesync.com    | password123 |

## 📦 Project Structure

```
Backend-Node/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── providerController.js
│   ├── adminController.js
│   └── serviceController.js
├── models/            # MongoDB schemas
│   ├── User.js
│   ├── Provider.js
│   ├── Service.js
│   ├── Booking.js
│   ├── Payment.js
│   ├── Review.js
│   └── PlatformConfig.js
├── routes/            # API routes
│   ├── auth.js
│   ├── user.js
│   ├── provider.js
│   ├── admin.js
│   └── service.js
├── middleware/        # Custom middleware
│   └── auth.js
├── utils/             # Helper functions
│   └── helpers.js
├── server.js          # Main application
├── seed.js            # Database seeding
├── package.json
└── .env               # Environment variables
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get the token from login response and include it in subsequent requests.

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (user, provider, admin)
- Account blocking functionality
- Input validation
- CORS enabled

## 🧪 Testing

Test the API endpoints using:

- Postman
- cURL
- Frontend application at http://localhost:3000

Example cURL request:

```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"user@servesync.com","password":"password123"}'
```

## 📝 Environment Variables

| Variable                | Description               | Default                             |
| ----------------------- | ------------------------- | ----------------------------------- |
| PORT                    | Server port               | 8080                                |
| MONGODB_URI             | MongoDB connection string | mongodb://localhost:27017/servesync |
| JWT_SECRET              | Secret for JWT signing    | (change in production)              |
| JWT_EXPIRE              | Token expiration time     | 7d                                  |
| PLATFORM_FEE_PERCENTAGE | Platform fee percentage   | 10                                  |

## 🔄 Database Models

- **User:** User accounts (user/provider/admin)
- **Provider:** Provider profiles and business info
- **Service:** Services offered by providers
- **Booking:** Service booking records
- **Payment:** Payment transactions
- **Review:** Service reviews and ratings
- **PlatformConfig:** Platform settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

ISC

## 🆘 Support

For issues and questions, please open an issue in the repository.

---

**Built with:** Node.js, Express.js, MongoDB, JWT, bcrypt
