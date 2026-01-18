# 🚀 Quick Reference Card

## Getting Started (Copy & Paste Commands)

### Option 1: Windows Users (Easiest)

```bash
# Just double-click this file:
START_ALL.bat
```

### Option 2: Manual Startup

**Command 1 - Start Backend:**

```bash
cd Backend
mvn spring-boot:run
```

**Command 2 - Start Frontend:**

```bash
cd Frontend
npm install
npm run dev
```

**Command 3 - Start MongoDB (Optional):**

```bash
mongod
```

---

## URLs

| Service     | URL                       | Port  |
| ----------- | ------------------------- | ----- |
| Frontend    | http://localhost:3000     | 3000  |
| Backend API | http://localhost:8080     | 8080  |
| MongoDB     | mongodb://localhost:27017 | 27017 |

---

## Test Credentials

```
USER ACCOUNT:
Email: user@servesync.com
Password: password

PROVIDER ACCOUNT:
Email: provider@servesync.com
Password: password

ADMIN ACCOUNT:
Email: admin@servesync.com
Password: password
```

---

## Common Commands

```bash
# Frontend
cd Frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code quality

# Backend
cd Backend
mvn clean install    # Build project
mvn spring-boot:run  # Start backend
mvn test             # Run tests

# Database
mongod               # Start MongoDB
mongosh              # MongoDB shell
```

---

## API Quick Reference

### Login

```javascript
import { authAPI } from "../services/api";

// User login
await authAPI.userLogin("email@example.com", "password");

// Provider login
await authAPI.providerLogin("email@example.com", "password");

// Admin login
await authAPI.adminLogin("email@example.com", "password");
```

### Get User Profile

```javascript
import { userAPI } from "../services/api";

const profile = await userAPI.getProfile(userId);
```

### Get Services

```javascript
import { userAPI } from "../services/api";

const services = await userAPI.getAllServices();
```

### Create Booking

```javascript
const booking = await userAPI.bookService({
  serviceId: "123",
  userId: "user-id",
  date: "2025-01-20",
});
```

---

## Key Files

| File                                                                 | Purpose         |
| -------------------------------------------------------------------- | --------------- |
| `Frontend/src/services/api.js`                                       | All API calls   |
| `Frontend/src/context/AuthContext.jsx`                               | Authentication  |
| `Frontend/.env`                                                      | Configuration   |
| `Backend/src/main/java/com/servesync/controller/AuthController.java` | Login endpoints |
| `Backend/src/main/java/com/servesync/config/CorsConfig.java`         | CORS settings   |

---

## Troubleshooting

```bash
# Port already in use? Kill process
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :8080
kill -9 <PID>
```

---

## Documentation Files

1. `README_START_HERE.md` - Overview
2. `SETUP_AND_RUN.md` - Detailed guide
3. `VERIFICATION_CHECKLIST.md` - Verify setup
4. `INTEGRATION_COMPLETE.md` - What was done

---

## Key Status

✅ Frontend connected to Backend
✅ API service layer created
✅ Authentication working
✅ CORS configured
✅ Documentation complete
✅ Ready for development

---

## Next Step

1. Start services (see above)
2. Open http://localhost:3000
3. Click Login
4. Enter test credentials
5. Start developing!

---

_All systems ready!_ 🚀
