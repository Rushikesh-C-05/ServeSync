# ServeSync Backend - Complete Documentation

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Image Upload System](#image-upload-system)
- [Payment System](#payment-system)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## 🎯 Overview

ServeSync Backend is a comprehensive RESTful API built with Node.js and Express.js, providing a complete service marketplace platform. It supports three user roles (User, Provider, Admin) with distinct functionalities for each.

### Key Features

- ✅ Multi-role authentication system (User, Provider, Admin)
- ✅ Service marketplace with search and filtering
- ✅ Complete booking workflow with status management
- ✅ Provider application and approval system
- ✅ Payment tracking and platform fee management
- ✅ Review and rating system
- ✅ Image upload with Cloudinary integration
- ✅ Real-time statistics and analytics
- ✅ Admin dashboard for platform management

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 14+ | Runtime environment |
| Express.js | ^4.18.2 | Web framework |
| MongoDB | 4.4+ | Database |
| Mongoose | ^8.0.3 | ODM for MongoDB |
| JWT | ^9.0.2 | Authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| Cloudinary | ^1.41.3 | Image storage |
| Multer | ^2.0.2 | File upload handling |
| Razorpay | ^2.9.6 | Payment gateway |
| CORS | ^2.8.5 | Cross-origin requests |

---

## 📁 Project Structure

```
Backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration & storage
├── controllers/
│   ├── adminController.js     # Admin operations
│   ├── authController.js      # Authentication logic
│   ├── paymentController.js   # Payment processing
│   ├── providerController.js  # Provider operations
│   ├── serviceController.js   # Service management
│   ├── uploadController.js    # Image upload handlers
│   └── userController.js      # User operations
├── middleware/
│   └── auth.js                # JWT verification & role checks
├── models/
│   ├── Booking.js             # Booking schema
│   ├── Payment.js             # Payment records
│   ├── PlatformConfig.js      # Platform settings
│   ├── Provider.js            # Provider profiles
│   ├── ProviderApplication.js # Provider applications
│   ├── Review.js              # Service reviews
│   ├── Service.js             # Service listings
│   └── User.js                # User accounts
├── routes/
│   ├── admin.js               # Admin routes
│   ├── auth.js                # Authentication routes
│   ├── payment.js             # Payment routes
│   ├── provider.js            # Provider routes
│   ├── service.js             # Service routes
│   ├── upload.js              # Upload routes
│   └── user.js                # User routes
├── utils/
│   └── helpers.js             # Utility functions
├── .env                       # Environment variables
├── package.json               # Dependencies
├── seed.js                    # Database seeder
└── server.js                  # Application entry point
```

---

## 🚀 Installation & Setup

### Prerequisites

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   ```

2. **MongoDB** (v4.4 or higher)
   ```bash
   mongod --version
   ```

3. **Cloudinary Account** (for image uploads)
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret

### Installation Steps

1. **Install dependencies:**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Create .env file with:
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/servesync
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   PLATFORM_FEE_PERCENTAGE=10
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Razorpay (Optional - for payment integration)
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

3. **Start MongoDB:**
   ```bash
   mongod
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation:**
   ```bash
   curl http://localhost:8080/api/user/test
   # Should return: {"success":true,"message":"User service is running","data":"OK"}
   ```

---

## ⚙️ Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/servesync` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key` |
| `JWT_EXPIRE` | Token expiration time | `7d` (7 days) |
| `PLATFORM_FEE_PERCENTAGE` | Platform commission | `10` (10%) |

### Image Upload Configuration

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Dashboard → Account Details |
| `CLOUDINARY_API_KEY` | API Key | Dashboard → Account Details |
| `CLOUDINARY_API_SECRET` | API Secret | Dashboard → Account Details |

### Payment Configuration

| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret |

---

## 💾 Database Models

### User Model
**File:** `models/User.js`

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  phone: String,
  address: String,
  role: Enum ['user', 'provider', 'admin'],
  profileImage: String (Cloudinary URL),
  isBlocked: Boolean,
  providerRejected: Boolean,
  canReapply: Boolean,
  providerRejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Key Methods:**
- `comparePassword(password)` - Compare plain text with hashed password

### Provider Model
**File:** `models/Provider.js`

```javascript
{
  userId: ObjectId (ref: User, required),
  businessName: String (required),
  businessDescription: String,
  category: String,
  experience: String,
  phone: String,
  address: String,
  certifications: String,
  portfolio: String,
  profileImage: String (Cloudinary URL),
  status: Enum ['pending', 'approved', 'rejected'],
  rating: Number (default: 0),
  totalReviews: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
**File:** `models/Service.js`

```javascript
{
  providerId: ObjectId (ref: Provider, required),
  name: String (required),
  description: String (required),
  category: String (required),
  price: Number (required),
  duration: Number (in minutes),
  image: String (Cloudinary URL),
  location: String,
  isAvailable: Boolean (default: true),
  rating: Number (default: 0),
  totalReviews: Number (default: 0),
  totalBookings: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
**File:** `models/Booking.js`

```javascript
{
  userId: ObjectId (ref: User, required),
  serviceId: ObjectId (ref: Service, required),
  providerId: ObjectId (ref: Provider, required),
  bookingDate: Date (required),
  bookingTime: String,
  userAddress: String,
  notes: String,
  status: Enum ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
  serviceAmount: Number,
  platformFee: Number,
  totalAmount: Number,
  paymentStatus: Enum ['pending', 'completed', 'failed', 'refunded'],
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Status Flow:**
```
pending → confirmed → completed
   ↓          ↓
rejected   cancelled
```

### Payment Model
**File:** `models/Payment.js`

```javascript
{
  bookingId: ObjectId (ref: Booking, required),
  userId: ObjectId (ref: User, required),
  providerId: ObjectId (ref: Provider, required),
  amount: Number (required),
  platformFee: Number,
  providerAmount: Number,
  paymentMethod: String,
  paymentStatus: Enum ['pending', 'completed', 'failed', 'refunded'],
  razorpayOrderId: String,
  razorpayPaymentId: String,
  transactionDate: Date,
  createdAt: Date
}
```

### Review Model
**File:** `models/Review.js`

```javascript
{
  userId: ObjectId (ref: User, required),
  serviceId: ObjectId (ref: Service, required),
  providerId: ObjectId (ref: Provider, required),
  bookingId: ObjectId (ref: Booking, required),
  rating: Number (1-5, required),
  comment: String,
  providerResponse: String,
  respondedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### ProviderApplication Model
**File:** `models/ProviderApplication.js`

```javascript
{
  userId: ObjectId (ref: User, required),
  businessName: String (required),
  businessDescription: String (required),
  category: String (required),
  experience: String (required),
  phone: String (required),
  address: String (required),
  certifications: String,
  portfolio: String,
  businessImage: String (Cloudinary URL),
  status: Enum ['pending', 'approved', 'rejected'],
  adminNotes: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  submittedAt: Date
}
```

### PlatformConfig Model
**File:** `models/PlatformConfig.js`

```javascript
{
  feePercentage: Number (default: 10),
  minBookingAmount: Number,
  maxBookingAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication Routes (`/auth`)

#### Register User
```http
POST /auth/register
Content-Type: multipart/form-data

Form Data:
- email: string (required)
- password: string (required, min 6 chars)
- name: string (required)
- phone: string (required)
- address: string (required)
- profileImage: file (optional, max 5MB)

Response: {
  success: true,
  message: "User registered successfully",
  data: { user object without password }
}
```

#### User Login
```http
POST /auth/login/user
Content-Type: application/json

{
  "email": "user@servesync.com",
  "password": "password123"
}

Response: {
  success: true,
  message: "Login successful",
  data: {
    token: "jwt-token",
    user: { user object }
  }
}
```

#### Provider Login
```http
POST /auth/login/provider
Content-Type: application/json

{
  "email": "provider@servesync.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /auth/login/admin
Content-Type: application/json

{
  "email": "admin@servesync.com",
  "password": "password123"
}
```

### User Routes (`/user`)

All routes require authentication. Include JWT token in header:
```
Authorization: Bearer <token>
```

#### Get User Dashboard Stats
```http
GET /user/:userId/dashboard

Response: {
  success: true,
  data: {
    totalBookings: number,
    activeBookings: number,
    completedBookings: number,
    totalSpent: number,
    recentBookings: [...]
  }
}
```

#### Submit Provider Application
```http
POST /user/:userId/provider-application
Content-Type: multipart/form-data

Form Data:
- businessName: string (required)
- businessDescription: string (required)
- category: string (required)
- experience: string (required)
- phone: string (required)
- address: string (required)
- certifications: string (optional)
- portfolio: string (optional)
- businessImage: file (optional, max 5MB)
```

#### Book a Service
```http
POST /user/:userId/bookings
Content-Type: application/json

{
  "serviceId": "service_id",
  "bookingDate": "2026-01-25",
  "bookingTime": "10:00 AM",
  "userAddress": "123 Main St",
  "notes": "Optional notes"
}
```

#### Get User Bookings
```http
GET /user/:userId/bookings?status=pending&page=1&limit=10
```

#### Cancel Booking
```http
PATCH /user/:userId/bookings/:bookingId/cancel
Content-Type: application/json

{
  "reason": "Cancellation reason"
}
```

#### Submit Review
```http
POST /user/:userId/reviews
Content-Type: application/json

{
  "bookingId": "booking_id",
  "serviceId": "service_id",
  "rating": 5,
  "comment": "Great service!"
}
```

### Provider Routes (`/provider`)

#### Get Provider Dashboard Stats
```http
GET /provider/:userId/dashboard

Response: {
  success: true,
  data: {
    totalServices: number,
    activeBookings: number,
    completedBookings: number,
    totalEarnings: number,
    averageRating: number,
    recentBookings: [...]
  }
}
```

#### Create Service
```http
POST /provider/:userId/services
Content-Type: multipart/form-data

Form Data:
- name: string (required)
- description: string (required)
- category: string (required)
- price: number (required)
- duration: number (required, in minutes)
- location: string (optional)
- isAvailable: boolean (default: true)
- image: file (optional, max 5MB)
```

#### Get Provider Services
```http
GET /provider/:userId/services
```

#### Update Service
```http
PUT /provider/:userId/services/:serviceId
Content-Type: application/json

{
  "name": "Updated service name",
  "price": 150,
  "isAvailable": true
}
```

#### Delete Service
```http
DELETE /provider/:userId/services/:serviceId
```

#### Get Provider Bookings
```http
GET /provider/:userId/bookings?status=pending
```

#### Accept Booking
```http
PATCH /provider/:userId/bookings/:bookingId/accept
```

#### Reject Booking
```http
PATCH /provider/:userId/bookings/:bookingId/reject
Content-Type: application/json

{
  "reason": "Rejection reason"
}
```

#### Complete Booking
```http
PATCH /provider/:userId/bookings/:bookingId/complete
```

#### Get Provider Earnings
```http
GET /provider/:userId/earnings

Response: {
  success: true,
  data: {
    totalEarnings: number,
    platformFees: number,
    netEarnings: number,
    monthlyEarnings: [...],
    recentPayments: [...]
  }
}
```

#### Respond to Review
```http
POST /provider/:userId/reviews/:reviewId/respond
Content-Type: application/json

{
  "response": "Thank you for your feedback!"
}
```

### Admin Routes (`/admin`)

#### Get Platform Statistics
```http
GET /admin/stats

Response: {
  success: true,
  data: {
    totalUsers: number,
    totalProviders: number,
    totalServices: number,
    totalBookings: number,
    totalRevenue: number,
    platformEarnings: number,
    pendingApplications: number,
    recentActivity: [...]
  }
}
```

#### Get All Users
```http
GET /admin/users?page=1&limit=10&search=john
```

#### Block/Unblock User
```http
PATCH /admin/users/:userId/toggle-block
```

#### Get All Providers
```http
GET /admin/providers?status=approved&page=1
```

#### Get Pending Applications
```http
GET /admin/providers/pending
```

#### Approve Provider Application
```http
PATCH /admin/providers/:providerId/approve
Content-Type: application/json

{
  "adminNotes": "Approved after verification"
}
```

#### Reject Provider Application
```http
PATCH /admin/providers/:providerId/reject
Content-Type: application/json

{
  "adminNotes": "Missing certifications",
  "canReapply": true
}
```

#### Get All Services
```http
GET /admin/services?category=Plumbing&page=1
```

#### Get All Bookings
```http
GET /admin/bookings?status=completed&page=1
```

#### Get All Payments
```http
GET /admin/payments?page=1
```

#### Update Platform Fee
```http
PATCH /admin/platform-fee
Content-Type: application/json

{
  "feePercentage": 15
}
```

#### Get Platform Earnings
```http
GET /admin/earnings?startDate=2026-01-01&endDate=2026-01-31

Response: {
  success: true,
  data: {
    totalEarnings: number,
    monthlyBreakdown: [...],
    topProviders: [...],
    topServices: [...]
  }
}
```

### Service Routes (`/service`)

Public routes - no authentication required.

#### Get All Services
```http
GET /service?page=1&limit=10
```

#### Search Services
```http
GET /service/search?q=plumbing&category=Home&minPrice=50&maxPrice=200&location=New York
```

#### Get Services by Category
```http
GET /service/category/:category
```

#### Get Service Details
```http
GET /service/:serviceId

Response: {
  success: true,
  data: {
    service: { service object },
    provider: { provider info },
    reviews: [...]
  }
}
```

### Image Upload Routes (`/upload`)

#### Upload User Profile Image
```http
POST /upload/user/:userId
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- profileImage: file (max 5MB, jpg/png/gif/webp)

Response: {
  success: true,
  message: "Profile image uploaded",
  data: "https://cloudinary.com/..."
}
```

#### Delete User Profile Image
```http
DELETE /upload/user/:userId
Authorization: Bearer <token>
```

#### Upload Provider Profile Image
```http
POST /upload/provider/:userId
Content-Type: multipart/form-data
```

#### Upload Service Image
```http
POST /upload/service/:serviceId
Content-Type: multipart/form-data
```

### Payment Routes (`/payment`)

#### Create Razorpay Order
```http
POST /payment/create-order
Content-Type: application/json

{
  "bookingId": "booking_id",
  "amount": 1000
}

Response: {
  success: true,
  data: {
    orderId: "razorpay_order_id",
    amount: 1000,
    currency: "INR"
  }
}
```

#### Verify Payment
```http
POST /payment/verify
Content-Type: application/json

{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature",
  "bookingId": "booking_id"
}
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure

```javascript
{
  userId: "user_id",
  role: "user" | "provider" | "admin",
  iat: timestamp,
  exp: timestamp
}
```

### Middleware: `auth.js`

#### `auth` Middleware
Verifies JWT token and attaches user info to request.

```javascript
req.userId // User ID from token
req.userRole // User role
```

#### `adminAuth` Middleware
Ensures the user has admin role.

### Protected Routes

All routes except `/auth/*` and `/service/*` require authentication.

### Role-Based Access

- **User Routes**: Accessible only by users with 'user' or 'provider' role
- **Provider Routes**: Accessible only by users with 'provider' role
- **Admin Routes**: Accessible only by users with 'admin' role

---

## 📸 Image Upload System

### Cloudinary Configuration

**File:** `config/cloudinary.js`

#### Storage Folders
- `servesync/users` - User profile images
- `servesync/providers` - Provider profile images
- `servesync/services` - Service images

#### Image Specifications
- **Max file size:** 5MB
- **Allowed formats:** JPG, JPEG, PNG, GIF, WebP
- **Transformation:** Auto-resize to 800x800 (limit)

### Upload Flow

1. **Client** uploads file via multipart/form-data
2. **Multer** processes the file upload
3. **Cloudinary Storage** saves to cloud and returns URL
4. **Controller** updates database with image URL
5. **Response** returns the Cloudinary URL

### Image Upload Endpoints

```javascript
// During registration
POST /auth/register (with profileImage file)

// During provider application
POST /user/:userId/provider-application (with businessImage file)

// During service creation
POST /provider/:userId/services (with image file)

// Update existing images
POST /upload/user/:userId (profileImage)
POST /upload/provider/:userId (profileImage)
POST /upload/service/:serviceId (image)

// Delete images
DELETE /upload/user/:userId
DELETE /upload/provider/:userId
DELETE /upload/service/:serviceId
```

### Delete Image Utility

Automatically extracts public_id from Cloudinary URL and removes the image from cloud storage.

---

## 💳 Payment System

### Platform Fee Structure

```javascript
serviceAmount = Service Price
platformFee = serviceAmount * (feePercentage / 100)
totalAmount = serviceAmount + platformFee
providerAmount = serviceAmount
```

### Payment Flow

1. **User books service** → Booking created with status 'pending'
2. **Create Razorpay order** → Order ID generated
3. **User completes payment** → Payment verified
4. **Update booking** → Status changed to 'confirmed'
5. **Create payment record** → Transaction saved
6. **Provider completes service** → Booking marked 'completed'
7. **Platform fee deducted** → Provider receives net amount

### Razorpay Integration

```javascript
// Create Order
const order = await razorpay.orders.create({
  amount: amount * 100, // Convert to paise
  currency: "INR",
  receipt: `receipt_${bookingId}`
});

// Verify Payment
const sign = razorpayOrderId + "|" + razorpayPaymentId;
const expectedSign = crypto
  .createHmac("sha256", RAZORPAY_KEY_SECRET)
  .update(sign)
  .digest("hex");
```

---

## 🚨 Error Handling

### Standard Response Format

#### Success Response
```javascript
{
  success: true,
  message: "Operation successful",
  data: { ... }
}
```

#### Error Response
```javascript
{
  success: false,
  message: "Error message",
  error: "Detailed error (in development)"
}
```

### Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

### Error Scenarios

```javascript
// Authentication Error
{
  success: false,
  message: "Invalid credentials"
}

// Validation Error
{
  success: false,
  message: "Email already registered"
}

// Authorization Error
{
  success: false,
  message: "Access denied. Admin only."
}

// Not Found Error
{
  success: false,
  message: "Service not found"
}
```

---

## 🧪 Testing

### Test Accounts (After Seeding)

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| User | user@servesync.com | password123 | Regular user account |
| Provider | provider@servesync.com | password123 | Approved provider |
| Admin | admin@servesync.com | password123 | Platform admin |

### Manual Testing with cURL

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"user@servesync.com","password":"password123"}'
```

#### Get Services
```bash
curl http://localhost:8080/api/service
```

#### Create Booking (with auth)
```bash
curl -X POST http://localhost:8080/api/user/USER_ID/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceId": "SERVICE_ID",
    "bookingDate": "2026-01-25",
    "bookingTime": "10:00 AM",
    "userAddress": "123 Main St"
  }'
```

### Testing with Postman

1. Import the API collection
2. Set environment variables:
   - `base_url`: `http://localhost:8080/api`
   - `user_token`: (from login response)
   - `provider_token`: (from login response)
   - `admin_token`: (from login response)

3. Test flows:
   - **User Flow**: Login → Browse Services → Book Service → Submit Review
   - **Provider Flow**: Login → Create Service → Accept Booking → Complete Booking
   - **Admin Flow**: Login → View Stats → Approve Provider → Manage Platform

---

## 📊 Database Seeding

### Seed Data Includes

- 1 Admin account
- 5 User accounts
- 3 Provider accounts (approved)
- 12 Services across categories
- Sample bookings and reviews
- Platform configuration

### Run Seeder

```bash
npm run seed
```

### Categories Seeded

- Home Repair
- Cleaning
- Beauty & Wellness
- Education
- Technology
- Events

---

## 🔧 Utility Functions

**File:** `utils/helpers.js`

### `generateToken(userId)`
Generates JWT token for authentication.

```javascript
const token = generateToken(user._id);
```

### `apiResponse(success, message, data)`
Standardizes API responses.

```javascript
res.json(apiResponse(true, "Success", data));
res.json(apiResponse(false, "Error occurred"));
```

---

## 🔒 Security Best Practices

1. **Password Security**
   - Passwords hashed with bcrypt (10 rounds)
   - Never store plain text passwords
   - Password min length: 6 characters

2. **JWT Security**
   - Change JWT_SECRET in production
   - Set appropriate expiration time
   - Validate token on each request

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database operations
   - Use Mongoose schema validation

4. **CORS Configuration**
   - Configure allowed origins
   - Set appropriate headers
   - Enable credentials if needed

5. **Environment Variables**
   - Never commit .env file
   - Use strong secrets in production
   - Rotate credentials regularly

6. **File Upload Security**
   - Limit file size (5MB)
   - Validate file types
   - Use Cloudinary transformations

7. **Rate Limiting** (Recommended)
   - Implement rate limiting for API calls
   - Prevent brute force attacks
   - Protect against DoS

---

## 📈 Performance Optimization

1. **Database Indexes**
   - Email index on User model
   - Provider ID index on Service model
   - Booking date index for queries

2. **Query Optimization**
   - Use `.select()` to limit fields
   - Populate only needed relationships
   - Implement pagination

3. **Caching** (Future Enhancement)
   - Cache frequently accessed data
   - Use Redis for session storage
   - Cache service listings

---

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB URI
- [ ] Set up Cloudinary production account
- [ ] Configure Razorpay live keys
- [ ] Enable CORS for production domain
- [ ] Set up SSL certificate
- [ ] Configure environment variables
- [ ] Set up error logging (Sentry, etc.)
- [ ] Implement rate limiting
- [ ] Set up database backups
- [ ] Configure CDN for static assets
- [ ] Enable MongoDB replica sets
- [ ] Set up monitoring and alerts

### Deployment Platforms

- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2**: Full control with PM2
- **Digital Ocean**: Cost-effective with managed MongoDB
- **Railway**: Simple deployment with built-in MongoDB

---

## 📞 Support & Contributing

### Getting Help

- Check existing issues on GitHub
- Review documentation thoroughly
- Test with provided seed data

### Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

ISC License

---

**Last Updated:** January 19, 2026  
**Version:** 1.0.0  
**Built with:** Node.js, Express.js, MongoDB, JWT, Cloudinary
