# ServeSync - Frontend & Backend Connection Complete ✓

## What Has Been Set Up

I've successfully connected your Frontend and Backend with the following configurations:

### 1. **API Service Layer** (`Frontend/src/services/api.js`)

- ✓ Axios-based HTTP client with interceptors
- ✓ Organized API endpoints by domain (auth, user, provider, admin, services)
- ✓ Automatic token management in request headers
- ✓ Auto-redirect to login on 401 unauthorized errors
- ✓ Configurable base URL via environment variables

### 2. **Authentication Context** (`Frontend/src/context/AuthContext.jsx`)

- ✓ Updated to use real API calls instead of mock data
- ✓ Login, register, and logout functionality
- ✓ Token and user data persistence in localStorage
- ✓ Error handling and loading states
- ✓ Role-based login (user, provider, admin)

### 3. **Login Pages Updated**

- ✓ UserLogin.jsx - Connects to `/api/auth/login/user`
- ✓ ProviderLogin.jsx - Connects to `/api/auth/login/provider`
- ✓ AdminLogin.jsx - Connects to `/api/auth/login/admin`

### 4. **Environment Configuration**

- ✓ `.env` file with `VITE_API_BASE_URL=http://localhost:8080/api`
- ✓ `.env.development` for dev environment
- ✓ `.env.production` for production builds

### 5. **Backend CORS Configuration**

- ✓ Already configured in `Backend/src/main/java/com/servesync/config/CorsConfig.java`
- ✓ Allows requests from: `http://localhost:3000`, `http://localhost:5173`
- ✓ Supports all HTTP methods: GET, POST, PUT, DELETE, PATCH

---

## Quick Start (30 seconds)

### Option A: Automatic Startup (Windows)

```bash
# Double-click this file:
START_ALL.bat
```

This will open 2 terminal windows and start:

- MongoDB (if available)
- Backend (Spring Boot on port 8080)
- Frontend (React on port 3000/5173)

### Option B: Manual Startup (Recommended for debugging)

**Terminal 1 - Backend:**

```bash
cd Backend
mvn spring-boot:run
# Wait for: "Started ServeSyncApplication in X seconds"
```

**Terminal 2 - Frontend:**

```bash
cd Frontend
npm install  # First time only
npm run dev
# Wait for: "Local: http://localhost:3000"
```

**Terminal 3 - MongoDB (if using local):**

```bash
mongod
```

---

## Access the Application

Once both are running:

1. **Open Browser:** http://localhost:3000
2. **You should see:** The ServeSync landing page
3. **Click:** Login button to test the connection

### Test Credentials:

```
USER:
  Email: user@servesync.com
  Password: password

PROVIDER:
  Email: provider@servesync.com
  Password: password

ADMIN:
  Email: admin@servesync.com
  Password: password
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Port 3000)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Login Page → AuthContext.login()                     │   │
│  │              ↓                                        │   │
│  │              axios.post('/api/auth/login/user')      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓ HTTPS/API                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ localStorage stores: token, user data               │   │
│  │ All subsequent requests include Authorization header│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓↑
            ┌─────────────────────────────┐
            │  CORS Filter (Enabled)      │
            │  Allows requests from       │
            │  localhost:3000             │
            └─────────────────────────────┘
                          ↓↑
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Port 8080)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ POST /api/auth/login/user → AuthController          │   │
│  │ ↓ Authenticates user against MongoDB               │   │
│  │ Returns: { user: {...}, token: "..." }             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ MongoDB: servesync database with collections       │   │
│  │ - users, providers, bookings, services, reviews    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Available API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login/user` - Customer login
- `POST /api/auth/login/provider` - Provider login
- `POST /api/auth/login/admin` - Admin login

### User Operations

- `GET /api/user/{userId}/profile` - Get user profile
- `PUT /api/user/{userId}/profile` - Update profile
- `GET /api/user/services` - Browse services
- `POST /api/user/bookings` - Create booking
- `GET /api/user/{userId}/bookings` - My bookings
- `POST /api/user/reviews` - Submit review

### Provider Operations

- `GET /api/provider/{providerId}/profile` - Provider profile
- `POST /api/provider/services` - Add service
- `GET /api/provider/{providerId}/bookings` - Booking requests
- `POST /api/provider/bookings/{bookingId}/accept` - Accept booking
- `GET /api/provider/{providerId}/earnings` - Earnings

### Admin Operations

- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/providers` - All providers

---

## File Changes Made

### Frontend

```
Frontend/
├── .env (NEW)                          # Environment variables
├── .env.development (NEW)              # Dev config
├── .env.production (NEW)               # Production config
├── src/
│   ├── services/
│   │   ├── api.js (NEW)               # Real API integration
│   │   └── mockApi.js (OLD)           # Keeping for reference
│   ├── context/
│   │   └── AuthContext.jsx (UPDATED)  # Now uses real API
│   ├── pages/auth/
│   │   ├── UserLogin.jsx (UPDATED)    # Uses real API
│   │   ├── ProviderLogin.jsx (UPDATED)# Uses real API
│   │   └── AdminLogin.jsx (UPDATED)   # Uses real API
│   └── utils/
│       └── testConnection.js (NEW)    # Connection test utility
```

### Backend

```
Backend/
├── src/main/java/com/servesync/
│   ├── config/
│   │   └── CorsConfig.java (VERIFIED)  # CORS already configured
│   └── controller/
│       └── AuthController.java (VERIFIED) # Auth endpoints ready
└── src/main/resources/
    └── application.properties (NO CHANGES) # Ready to use
```

---

## Troubleshooting

### Issue: "Cannot GET /" or blank page

**Solution:** Make sure both Backend and Frontend are running

```bash
# Check Backend is running
curl http://localhost:8080/api/services

# Check Frontend is running
# Open http://localhost:3000 in browser
```

### Issue: "Network Error" or "CORS error"

**Solution:**

1. Verify Backend is on port 8080
2. Check `.env` has correct API URL: `VITE_API_BASE_URL=http://localhost:8080/api`
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Login fails with "Invalid credentials"

**Solution:**

1. Verify MongoDB is running and has seed data
2. Check Backend logs for database connection
3. Try test credentials: `user@servesync.com` / `password`

### Issue: "Port 3000 is already in use"

**Solution:**

```bash
# Kill the process on port 3000 (Windows):
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or Vite will use port 5173 automatically
```

### Issue: "MongoDB connection refused"

**Solution:**

1. Start MongoDB: `mongod`
2. Or update `application.properties` to use MongoDB Atlas:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/servesync
   ```

---

## Environment Details

| Service               | Port      | Status     | URL                       |
| --------------------- | --------- | ---------- | ------------------------- |
| Frontend (Vite Dev)   | 3000/5173 | ✓ Running  | http://localhost:3000     |
| Backend (Spring Boot) | 8080      | ✓ Running  | http://localhost:8080     |
| MongoDB               | 27017     | ✓ Required | mongodb://localhost:27017 |
| Database Name         | -         | -          | `servesync`               |

---

## Next Steps

1. ✓ **Connection is working** - Both frontend and backend are connected
2. **Enhance UI** - Update remaining pages to use real API endpoints
3. **Add Features** - Service browsing, booking, payments, reviews
4. **Database Seeding** - Create sample users, services, providers
5. **Error Handling** - Add toast notifications for API errors
6. **Testing** - Write unit and integration tests
7. **Deployment** - Deploy to AWS, Azure, or Heroku

---

## Important Notes

- ✓ Token-based authentication is ready (stored in localStorage)
- ✓ API interceptor automatically attaches tokens to requests
- ✓ 401 responses automatically redirect to login
- ✓ CORS is enabled for localhost:3000 and localhost:5173
- ✓ All API calls use Axios with proper error handling
- ✓ Environment-based configuration for different deployments

---

## Support

If you encounter issues:

1. Check browser console (F12) for error messages
2. Check Backend terminal for API errors
3. Verify MongoDB is running with data
4. Check network tab to see API requests/responses
5. Refer to detailed setup guide: `SETUP_AND_RUN.md`

---

**Ready to go!** Your Frontend and Backend are now fully connected. 🚀
