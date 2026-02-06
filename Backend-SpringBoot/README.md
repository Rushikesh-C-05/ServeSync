# ServeSync Backend - Spring Boot

A comprehensive Spring Boot backend application for ServeSync - Service Provider Management Platform. This is a complete conversion from the Node.js/Express backend, maintaining the same API structure and functionality.

> **⚠️ Important**: If you're getting JWT signature errors, see [JWT_FIX_NOTES.md](JWT_FIX_NOTES.md) for the solution.

## 🚀 Features

- **RESTful API** with Spring Boot 3.2
- **MongoDB** database integration with Spring Data MongoDB
- **JWT Authentication** with Spring Security
- **Role-based Access Control** (User, Provider, Admin)
- **File Upload** with Cloudinary integration
- **Payment Integration** with Razorpay
- **Validation** with Jakarta Bean Validation
- **Exception Handling** with global exception handler
- **CORS Configuration** for frontend integration

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

## 🛠️ Installation

### 1. Clone the repository

```bash
cd Backend-SpringBoot
```

### 2. Configure Environment Variables

Copy the `.env.example` file and create your own configuration:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```properties
MONGODB_URI=mongodb://localhost:27017/servesync
JWT_SECRET=your-secret-key-change-in-production-minimum-32-characters-required
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Build the Project

```bash
mvn clean install
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

Or run the JAR file:

```bash
java -jar target/servesync-backend-1.0.0.jar
```

The server will start on `http://localhost:8080`

## 📁 Project Structure

```
Backend-SpringBoot/
├── src/
│   ├── main/
│   │   ├── java/com/servesync/
│   │   │   ├── ServeSyncApplication.java      # Main application class
│   │   │   ├── config/                        # Configuration classes
│   │   │   │   ├── CloudinaryConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── RequestLoggingFilter.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/                    # REST controllers
│   │   │   │   ├── AdminController.java
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── HealthController.java
│   │   │   │   ├── ProviderController.java
│   │   │   │   ├── ServiceController.java
│   │   │   │   ├── UploadController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/                           # Data Transfer Objects
│   │   │   │   ├── ApiResponse.java
│   │   │   │   ├── auth/
│   │   │   │   ├── booking/
│   │   │   │   ├── provider/
│   │   │   │   ├── service/
│   │   │   │   └── user/
│   │   │   ├── exception/                     # Exception handling
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── model/                         # Entity models
│   │   │   │   ├── Booking.java
│   │   │   │   ├── Payment.java
│   │   │   │   ├── PlatformConfig.java
│   │   │   │   ├── Provider.java
│   │   │   │   ├── ProviderApplication.java
│   │   │   │   ├── Review.java
│   │   │   │   ├── Service.java
│   │   │   │   └── User.java
│   │   │   ├── repository/                    # Data repositories
│   │   │   │   ├── BookingRepository.java
│   │   │   │   ├── PaymentRepository.java
│   │   │   │   ├── PlatformConfigRepository.java
│   │   │   │   ├── ProviderApplicationRepository.java
│   │   │   │   ├── ProviderRepository.java
│   │   │   │   ├── ReviewRepository.java
│   │   │   │   ├── ServiceRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/                      # Security components
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── JwtTokenProvider.java
│   │   │   └── service/                       # Business logic
│   │   │       ├── AuthService.java
│   │   │       ├── ProviderService.java
│   │   │       ├── ServiceService.java
│   │   │       ├── UploadService.java
│   │   │       └── UserService.java
│   │   └── resources/
│   │       └── application.properties         # Application configuration
├── .env.example                               # Environment variables template
├── pom.xml                                    # Maven configuration
└── README.md                                  # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/provider` - Provider login
- `POST /api/auth/login/admin` - Admin login

### User Endpoints

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/change-password` - Change password

### Provider Endpoints

- `POST /api/provider/apply` - Apply as provider
- `GET /api/provider/profile` - Get provider profile
- `PUT /api/provider/profile` - Update provider profile
- `GET /api/provider/services` - Get provider's services

### Service Endpoints

- `GET /api/service` - Get all available services
- `GET /api/service/{id}` - Get service by ID
- `GET /api/service/category/{category}` - Get services by category
- `POST /api/service` - Create new service (Provider only)
- `PUT /api/service/{id}` - Update service (Provider only)
- `DELETE /api/service/{id}` - Delete service (Provider only)
- `PATCH /api/service/{id}/toggle-availability` - Toggle service availability

### Admin Endpoints

- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/{id}/toggle-block` - Block/Unblock user
- `GET /api/admin/providers` - Get all providers
- `GET /api/admin/provider-applications` - Get pending applications
- `POST /api/admin/provider-applications/{id}/approve` - Approve application
- `POST /api/admin/provider-applications/{id}/reject` - Reject application

### Upload Endpoints

- `POST /api/upload/image` - Upload image to Cloudinary
- `DELETE /api/upload/image` - Delete image from Cloudinary

### Health Check

- `GET /api/health` - Health check endpoint

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🎯 API Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

## 🔒 Security Features

- **Password Hashing** with BCrypt
- **JWT Token** authentication and authorization
- **Role-based Access Control** (RBAC)
- **CORS** configuration for frontend integration
- **Input Validation** with Bean Validation
- **Account Blocking** mechanism
- **Stateless Sessions** with JWT

## 🧪 Testing

Run tests with:

```bash
mvn test
```

## 📦 Building for Production

1. Update `application.properties` for production environment
2. Build the JAR file:

```bash
mvn clean package -DskipTests
```

3. Run the JAR:

```bash
java -jar target/servesync-backend-1.0.0.jar
```

## 🌐 Environment Variables

| Variable                | Description                | Default                               |
| ----------------------- | -------------------------- | ------------------------------------- |
| `MONGODB_URI`           | MongoDB connection string  | `mongodb://localhost:27017/servesync` |
| `JWT_SECRET`            | Secret key for JWT signing | Required (min 32 chars)               |
| `JWT_EXPIRE`            | JWT expiration time        | `7d`                                  |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name      | Required                              |
| `CLOUDINARY_API_KEY`    | Cloudinary API key         | Required                              |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret      | Required                              |
| `RAZORPAY_KEY_ID`       | Razorpay key ID            | Required                              |
| `RAZORPAY_KEY_SECRET`   | Razorpay key secret        | Required                              |

## 🔄 Migration from Node.js

This Spring Boot backend maintains **100% API compatibility** with the original Node.js backend:

- ✅ Same API endpoints
- ✅ Same request/response structure
- ✅ Same authentication mechanism
- ✅ Same database schema
- ✅ Same error handling
- ✅ Same business logic

You can switch between Node.js and Spring Boot backends without any changes to your frontend!

## 📝 Key Differences from Node.js Backend

While maintaining API compatibility, the Spring Boot version offers:

1. **Type Safety** - Strong typing with Java
2. **Better Performance** - JVM optimization
3. **Enterprise Features** - Built-in Spring Boot features
4. **Better Dependency Management** - Maven ecosystem
5. **Enhanced Security** - Spring Security framework
6. **Better Scalability** - JVM optimization and threading

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check connection string in application.properties
- Verify network connectivity

### JWT Token Issues

- Ensure JWT_SECRET is at least 32 characters
- Check token expiration time
- Verify Authorization header format

### File Upload Issues

- Check Cloudinary credentials
- Verify file size limits in application.properties
- Check internet connectivity

## 📄 License

This project is licensed under the ISC License.

## � Additional Documentation

- [JWT Fix Notes](JWT_FIX_NOTES.md) - JWT token compatibility and troubleshooting
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Common issues and solutions
- [API Documentation](DOCUMENTATION.md) - Detailed API reference (coming soon)

## 🔥 Quick Commands

```bash
# Start the server
mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test

# Clean build artifacts
mvn clean

# Check for updates
mvn versions:display-dependency-updates
```

## �👥 Support

For issues and questions, please create an issue in the repository.

## 🎉 Acknowledgments

- Spring Boot Framework
- MongoDB
- Cloudinary
- Razorpay
- JWT.io
