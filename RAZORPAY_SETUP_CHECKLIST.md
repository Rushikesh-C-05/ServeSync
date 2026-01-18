# ✅ Razorpay Integration Setup Checklist

Use this checklist to ensure proper setup of the Razorpay payment integration.

## 📋 Pre-Setup

- [ ] I have a Razorpay account (or will create one)
- [ ] I have read [RAZORPAY_QUICKSTART.md](RAZORPAY_QUICKSTART.md)
- [ ] Backend and Frontend are working independently
- [ ] MongoDB is running and accessible

## 🔑 Get Razorpay Credentials

- [ ] Signed up at https://razorpay.com
- [ ] Logged into Razorpay Dashboard
- [ ] Switched to **Test Mode** (toggle at top right)
- [ ] Navigated to Settings → API Keys
- [ ] Copied **Key ID** (starts with `rzp_test_`)
- [ ] Copied **Key Secret** (keep this secure!)
- [ ] Stored credentials safely (not in version control)

## ⚙️ Backend Configuration

- [ ] Navigated to `Backend/` directory
- [ ] Copied `.env.example` to `.env`
  ```bash
  cd Backend
  cp .env.example .env
  ```
- [ ] Opened `.env` file in editor
- [ ] Added `RAZORPAY_KEY_ID=rzp_test_xxxxx`
- [ ] Added `RAZORPAY_KEY_SECRET=xxxxx`
- [ ] Saved `.env` file
- [ ] Verified MongoDB URI is correct
- [ ] Verified JWT_SECRET is set

**Example .env:**

```env
MONGO_URI=mongodb://localhost:27017/servesync
PORT=8080
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxx
```

## 💻 Frontend Configuration

- [ ] Navigated to `Frontend/` directory
- [ ] Copied `.env.example` to `.env`
  ```bash
  cd Frontend
  cp .env.example .env
  ```
- [ ] Opened `.env` file in editor
- [ ] Added `VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx` (same as backend Key ID)
- [ ] Saved `.env` file
- [ ] Verified API base URL is correct

**Example .env:**

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

## 🚀 Start Services

### Terminal 1 - Backend

- [ ] Opened terminal in `Backend/` directory
- [ ] Ran `npm run dev`
- [ ] Backend started successfully on port 8080
- [ ] Saw "MongoDB connected successfully" message
- [ ] No errors in console

### Terminal 2 - Frontend

- [ ] Opened terminal in `Frontend/` directory
- [ ] Ran `npm run dev`
- [ ] Frontend started successfully (usually port 5173)
- [ ] Browser opened automatically (or opened manually)
- [ ] No errors in console

## 🧪 Test the Integration

### Test User Login

- [ ] Navigated to user login page
- [ ] Logged in with test user credentials
  - Email: `user1@test.com`
  - Password: `password123`
- [ ] Successfully logged in
- [ ] Redirected to user dashboard

### Test Service Browsing

- [ ] Navigated to "Browse Services"
- [ ] Services are loading and displaying
- [ ] Can see service details (name, price, description)
- [ ] No errors in console

### Test Booking Flow

- [ ] Clicked on a service card
- [ ] Service details page loaded
- [ ] Selected a date (today or future date)
- [ ] Selected a time slot (e.g., 09:00 AM)
- [ ] Entered service address
- [ ] Clicked "Proceed to Payment"
- [ ] Payment summary screen appeared

### Test Payment Modal

- [ ] Payment summary shows correct amounts:
  - [ ] Service fee displayed
  - [ ] Platform fee (10%) displayed
  - [ ] Total amount calculated correctly
- [ ] "Powered by Razorpay" message visible
- [ ] Clicked "Pay with Razorpay" button
- [ ] Razorpay checkout modal opened
- [ ] Modal shows payment amount
- [ ] Multiple payment options visible (Card, UPI, etc.)

### Test Payment with Card

- [ ] Selected "Card" payment option
- [ ] Entered test card: `4111 1111 1111 1111`
- [ ] Entered CVV: `123`
- [ ] Entered expiry: `12/25`
- [ ] Clicked "Pay" button
- [ ] Payment processing indicator appeared
- [ ] Payment succeeded
- [ ] Success message displayed
- [ ] Redirected to "My Bookings" page
- [ ] Booking appears with "accepted" or "paid" status

### Test Payment with UPI (Optional)

- [ ] Selected "UPI" payment option
- [ ] Entered UPI ID: `success@razorpay`
- [ ] Clicked "Pay" button
- [ ] Payment succeeded
- [ ] Redirected to bookings page

## 🔍 Verify Backend

- [ ] Opened backend terminal
- [ ] Saw payment-related logs:
  - [ ] "Order creation" log
  - [ ] "Payment verification" log
- [ ] No error messages in backend console

## 🗄️ Verify Database

If using MongoDB Compass or CLI:

- [ ] Connected to MongoDB
- [ ] Navigated to `servesync` database
- [ ] Checked `bookings` collection:
  - [ ] New booking record exists
  - [ ] Status is "accepted"
  - [ ] Amounts are correct
- [ ] Checked `payments` collection:
  - [ ] New payment record exists
  - [ ] Status is "completed"
  - [ ] Contains razorpayOrderId
  - [ ] Contains razorpayPaymentId
  - [ ] Contains razorpaySignature

## 🌐 Check Browser Developer Tools

- [ ] Opened browser DevTools (F12)
- [ ] Checked **Console** tab:
  - [ ] No errors related to Razorpay
  - [ ] No 404 or 500 errors
- [ ] Checked **Network** tab:
  - [ ] `/api/payment/create-order` request succeeded (200)
  - [ ] `/api/payment/verify` request succeeded (200)
  - [ ] Razorpay script loaded successfully

## ❌ Test Failure Scenarios

### Test Failed Payment

- [ ] Started a new booking
- [ ] Clicked "Pay with Razorpay"
- [ ] Used test card: `4000 0000 0000 0002`
- [ ] Payment failed as expected
- [ ] Appropriate error message shown
- [ ] User can try again

### Test Payment Cancellation

- [ ] Started a new booking
- [ ] Clicked "Pay with Razorpay"
- [ ] Razorpay modal opened
- [ ] Clicked "X" or closed modal
- [ ] Got "Payment cancelled" message
- [ ] Booking remains in pending state
- [ ] Can attempt payment again

## 📱 Test Different Payment Methods (Optional)

### UPI

- [ ] Selected UPI option
- [ ] Used `success@razorpay`
- [ ] Payment succeeded

### NetBanking

- [ ] Selected NetBanking option
- [ ] Selected any test bank
- [ ] Completed payment flow

### Wallet

- [ ] Selected Wallet option
- [ ] Selected a wallet (e.g., Paytm)
- [ ] Completed payment flow

## 🔐 Security Verification

- [ ] Confirmed `.env` files are in `.gitignore`
- [ ] Verified Key Secret is NOT in frontend code
- [ ] Checked that amounts are calculated on backend
- [ ] Confirmed signature verification is on backend
- [ ] No sensitive data in browser console logs

## 📚 Documentation Review

- [ ] Read [RAZORPAY_QUICKSTART.md](RAZORPAY_QUICKSTART.md)
- [ ] Skimmed [RAZORPAY_INTEGRATION.md](RAZORPAY_INTEGRATION.md)
- [ ] Reviewed [PAYMENT_FLOW_VISUAL_GUIDE.md](PAYMENT_FLOW_VISUAL_GUIDE.md)
- [ ] Understand the payment flow
- [ ] Know where to find API documentation

## 🐛 Common Issues Resolved

If you encountered issues, check if you resolved them:

- [ ] "Razorpay is not defined" → Checked script loading
- [ ] "Invalid signature" → Verified KEY_SECRET is correct
- [ ] Modal doesn't open → Verified KEY_ID in frontend .env
- [ ] CORS errors → Checked backend CORS configuration
- [ ] Network errors → Verified backend is running on port 8080

## 🎓 Understanding Check

Answer these to verify understanding:

- [ ] I know where Razorpay Key ID is used (Frontend)
- [ ] I know where Razorpay Key Secret is used (Backend only)
- [ ] I understand Test Mode vs Live Mode
- [ ] I know payment signature is verified on backend
- [ ] I understand the booking-payment relationship
- [ ] I can explain the payment flow to someone else

## 🚀 Production Readiness (When Ready)

**DO NOT do these in development:**

- [ ] Understand how to switch to Live Mode keys
- [ ] Know that HTTPS is required in production
- [ ] Reviewed security best practices
- [ ] Planned for webhook implementation
- [ ] Set up payment monitoring
- [ ] Prepared for real transactions

## ✅ Final Confirmation

- [ ] All critical tests passed
- [ ] No blocking errors
- [ ] Payment flow works end-to-end
- [ ] Comfortable with the integration
- [ ] Ready to show to team/client (in test mode)

---

## 🎉 Congratulations!

If all checkboxes are marked, your Razorpay integration is successfully set up!

### Next Steps:

1. **Explore Features:**
   - Try booking multiple services
   - Test different payment methods
   - Explore the "My Bookings" page

2. **Learn More:**
   - Read full documentation in [RAZORPAY_INTEGRATION.md](RAZORPAY_INTEGRATION.md)
   - Explore Razorpay Dashboard features
   - Check payment analytics

3. **Customize:**
   - Adjust platform fee percentage
   - Customize payment success messages
   - Add booking notifications

4. **Share:**
   - Demo to team members
   - Gather feedback
   - Plan for production deployment

---

## 🆘 Need Help?

If any checklist item is not checked:

1. **Check Documentation:**
   - [RAZORPAY_QUICKSTART.md](RAZORPAY_QUICKSTART.md) - Quick fixes
   - [RAZORPAY_INTEGRATION.md](RAZORPAY_INTEGRATION.md) - Detailed troubleshooting

2. **Check Logs:**
   - Backend terminal for server errors
   - Browser console for frontend errors
   - Razorpay Dashboard for payment status

3. **Common Solutions:**
   - Restart backend and frontend
   - Clear browser cache
   - Check .env files are loaded
   - Verify all services are running

4. **Razorpay Resources:**
   - Documentation: https://razorpay.com/docs/
   - Support: Contact Razorpay support if needed

---

**Remember:** Always use Test Mode during development! 🔧

Good luck! 🚀
