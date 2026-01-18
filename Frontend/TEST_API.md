# API Integration Test Guide

## ✅ Completed Changes

### 1. **API Service (api.js)** - Updated all endpoints to match backend routes:

- **Auth API**: `/api/auth/*`
- **User API**: `/api/user/:userId/*` (with userId parameter)
- **Provider API**: `/api/provider/:userId/*` (with userId parameter)
- **Admin API**: `/api/admin/*`
- **Service API**: `/api/service/*` (changed from `/api/services`)

### 2. **AuthContext** - Fixed to handle backend response structure:

- Extracts `user` object from response
- Properly stores `token`, `userId`, and user data
- Uses `_id` field from MongoDB documents

### 3. **User Pages** - Converted to use real API:

- ✅ **UserDashboard**: Uses `serviceAPI` and `userAPI`
- ✅ **BrowseServices**: Uses `serviceAPI.getAllServices()`
- ✅ **BookingDetails**: Uses `serviceAPI` and `userAPI.bookService()`
- ✅ **MyBookings**: Fully implemented with cancel functionality

### 4. **Components** - Updated for backend data:

- ✅ **StatusBadge**: Added 'accepted' and 'rejected' statuses
- ✅ **ServiceCard**: Compatible with MongoDB `_id` field

## 🧪 Testing Instructions

### Start Backend Server:

```bash
cd Backend
node server.js
```

Server should start on: http://localhost:8080

### Start Frontend:

```bash
cd Frontend
npm run dev
```

Frontend should start on: http://localhost:5173

### Test Flow:

1. **Register/Login**:
   - Test accounts:
     - User: `user@servesync.com` / `password123`
     - Provider: `provider@servesync.com` / `password123`
     - Admin: `admin@servesync.com` / `password123`

2. **User Flow**:
   - Login as user
   - Browse services (should load from backend)
   - View service details
   - Create a booking
   - View "My Bookings"
   - Cancel a pending booking

3. **Check Backend Logs** for:
   - API requests being received
   - Authentication working
   - Database operations

## 📋 API Endpoint Mapping

| Frontend Call                              | Backend Route                                  | Method |
| ------------------------------------------ | ---------------------------------------------- | ------ |
| `authAPI.userLogin()`                      | `/api/auth/login/user`                         | POST   |
| `serviceAPI.getAllServices()`              | `/api/service/`                                | GET    |
| `userAPI.bookService(userId, data)`        | `/api/user/:userId/bookings`                   | POST   |
| `userAPI.getMyBookings(userId)`            | `/api/user/:userId/bookings`                   | GET    |
| `userAPI.cancelBooking(userId, bookingId)` | `/api/user/:userId/bookings/:bookingId/cancel` | PATCH  |

## 🔍 Known Data Structure Differences

Backend uses MongoDB, so objects have:

- `_id` instead of `id`
- Nested population for relationships (e.g., `serviceId`, `providerId`, `userId`)
- Response format: `{ success: true, message: "...", data: {...} }`

All frontend code has been updated to handle these structures.

## ⚠️ Notes

- Provider and Admin pages are still placeholder implementations
- Frontend properly handles backend response structure with `response.data?.data || response.data`
- All user-facing pages are now connected to the real backend
