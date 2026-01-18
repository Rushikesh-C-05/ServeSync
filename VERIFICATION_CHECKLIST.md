# Connection Verification Checklist ✓

## Pre-Flight Checks

- [ ] **Java 21 installed**

  ```bash
  java -version
  # Should show: java version "21.x.x"
  ```

- [ ] **Maven installed**

  ```bash
  mvn -v
  # Should show: Apache Maven 3.x.x
  ```

- [ ] **Node.js installed**

  ```bash
  node -v
  # Should show: v18.x or higher
  npm -v
  # Should show: 9.x or higher
  ```

- [ ] **MongoDB installed/running**
  ```bash
  mongod --version
  # Or check if service is running
  ```

---

## Step-by-Step Startup

### Step 1: Start Backend

```bash
cd Backend
mvn clean install  # First time only, takes 2-3 minutes
mvn spring-boot:run
```

**Expected Output:**

```
...
Started ServeSyncApplication in 4.521 seconds (process running for 4.843s)
```

**Verify Backend is ready:**

```bash
# In another terminal, test the API
curl http://localhost:8080/api/services
# Should return JSON response (empty array or error is ok)
```

✓ Backend Ready: http://localhost:8080

---

### Step 2: Start Frontend

```bash
cd Frontend
npm install  # First time only
npm run dev
```

**Expected Output:**

```
  ✔ 7 modules transformed.
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Or it might use port 3000 if 5173 is taken.

✓ Frontend Ready: http://localhost:3000 or http://localhost:5173

---

### Step 3: Verify Connection

Open your browser and go to: **http://localhost:3000**

You should see:

- [ ] ServeSync landing page loads
- [ ] Navigation menu appears
- [ ] No errors in browser console (F12)

Click **Login** button:

- [ ] "Customer Login" page loads
- [ ] Pre-filled email: `user@servesync.com`
- [ ] Pre-filled password: `password`

---

## Test Login

### Attempt 1: Customer Login

1. On UserLogin page, click **"Sign In"** button
2. Check browser console (F12 → Console tab)

**Success Indicators:**

```
✓ Request sent to http://localhost:8080/api/auth/login/user
✓ Response received (check Network tab)
✓ User dashboard loads OR error shows clearly
```

**If Error:** Check Backend terminal for error message

---

### Test Other Logins

1. Go to **http://localhost:3000**
2. Click menu → select other login options

#### Provider Login

- Email: `provider@servesync.com`
- Password: `password`
- Should redirect to: `/provider/dashboard`

#### Admin Login

- Email: `admin@servesync.com`
- Password: `password`
- Should redirect to: `/admin/dashboard`

---

## Network Debugging

### Check API Response in Browser

1. Open Developer Tools: **F12**
2. Go to **Network** tab
3. Click **Sign In** button
4. Look for request named `login/user` or similar
5. Click on it and check:
   - [ ] **Status**: 200 (success) or 401/400 (validation error)
   - [ ] **Response**: Contains user data
   - [ ] **Headers**: `Content-Type: application/json`

### Check Console for Errors

1. Open Developer Tools: **F12**
2. Go to **Console** tab
3. Look for error messages
4. Common errors:
   - `CORS error` → Backend CORS not configured
   - `Network error` → Backend not running
   - `401 Unauthorized` → Invalid credentials

---

## Backend Database Check

### View MongoDB Data (if using local)

```bash
# Open MongoDB shell
mongosh

# Inside MongoDB shell:
use servesync
db.users.find()          # List all users
db.providers.find()      # List all providers
db.services.find()       # List all services
```

If empty, you may need to:

1. Create test data manually, OR
2. Create a database seeder script

---

## Manual API Test with cURL

Test the connection without using the UI:

```bash
# Test 1: Get all services
curl http://localhost:8080/api/services

# Test 2: User Login (Windows - use quotes)
curl -X POST http://localhost:8080/api/auth/login/user ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"user@servesync.com\",\"password\":\"password\"}"

# Test 3: User Login (Mac/Linux)
curl -X POST http://localhost:8080/api/auth/login/user \
  -H "Content-Type: application/json" \
  -d '{"email":"user@servesync.com","password":"password"}'
```

Expected response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user-id-here",
    "name": "John Doe",
    "email": "user@servesync.com",
    "role": "user"
  }
}
```

---

## Common Issues & Fixes

### Issue: "Cannot GET /"

**Frontend not loading?**

- Is `npm run dev` running?
- Check if port is available
- Try port 5173 instead of 3000

### Issue: "Network Error" on Login

**Backend not responding?**

- Is `mvn spring-boot:run` running?
- Check if port 8080 is available
- Check for Java errors in backend terminal
- Is MongoDB running?

### Issue: Login Fails with No Error

**Check backend logs:**

- Look at Spring Boot terminal output
- Look for database connection errors
- Verify MongoDB has test user data

### Issue: CORS Error

**Response blocked by CORS?**

- Verify Backend is on port 8080
- Verify Frontend URL is in CORS config
- Check `Backend/src/main/java/com/servesync/config/CorsConfig.java`

### Issue: "Address already in use"

**Port taken?**

```bash
# Windows: Find process on port
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :8080
kill -9 <PID>
```

---

## Verification Checklist - Final

Once everything is running, verify:

- [ ] Frontend loads at `http://localhost:3000`
- [ ] Backend API responds at `http://localhost:8080/api/services`
- [ ] Can navigate to login pages (User, Provider, Admin)
- [ ] Login attempt sends request to backend (Network tab shows POST to `/api/auth/login/user`)
- [ ] No CORS errors in browser console
- [ ] MongoDB has connection (or error is clear if not running)
- [ ] All three terminal windows are running without errors

---

## Performance Notes

First startup may take:

- **Backend**: 30-60 seconds (first build)
- **Frontend**: 10-20 seconds (dependencies install)
- **After initial**: Each startup takes 5-10 seconds

---

## Success!

If you've checked all boxes above, your **Frontend ↔ Backend connection is working!**

Now you can:

1. Continue development
2. Add more features
3. Implement remaining pages
4. Connect database to UI
5. Test user workflows

---

## Next Commands to Try

Once verified:

```bash
# Build Frontend for production
npm run build

# Build Backend for production
mvn clean package

# Run tests (if configured)
npm run test
mvn test
```

---

**Happy Coding!** 🚀
