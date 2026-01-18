# Razorpay Payment Integration Guide

## Overview

This project integrates Razorpay payment gateway for secure online payments during service bookings. The integration handles order creation, payment processing, verification, and refunds.

## Features Implemented

### Backend Features

- ✅ Razorpay order creation
- ✅ Payment signature verification
- ✅ Payment status tracking
- ✅ Refund processing
- ✅ Booking-payment linkage
- ✅ Secure API endpoints

### Frontend Features

- ✅ Razorpay checkout integration
- ✅ Dynamic order creation
- ✅ Real-time payment verification
- ✅ User-friendly payment flow
- ✅ Error handling & feedback

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Go to [Dashboard](https://dashboard.razorpay.com/)
3. Navigate to Settings → API Keys
4. Generate/Copy your Key ID and Key Secret
5. For testing, use **Test Mode** keys

### 2. Backend Configuration

1. Navigate to the Backend directory:

   ```bash
   cd Backend
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Razorpay credentials:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Frontend Configuration

1. Navigate to the Frontend directory:

   ```bash
   cd Frontend
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Razorpay Key ID:

   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
   ```

   **Note:** Only add the Key ID (public key) in frontend, NEVER add the Key Secret.

### 4. Install Dependencies

Backend dependencies are already installed. If needed:

```bash
cd Backend
npm install
```

### 5. Start the Application

**Backend:**

```bash
cd Backend
npm run dev
```

**Frontend:**

```bash
cd Frontend
npm run dev
```

## Payment Flow

### User Journey

1. **Browse Services** → User browses available services
2. **Select Service** → User clicks on a service to view details
3. **Fill Booking Details** → User selects date, time, and enters address
4. **Proceed to Payment** → System creates a booking
5. **Razorpay Checkout** → Razorpay payment modal opens
6. **Complete Payment** → User completes payment using any method
7. **Verification** → Backend verifies payment signature
8. **Confirmation** → Booking status updated to "accepted"

### Technical Flow

```
Frontend                    Backend                     Razorpay
--------                    -------                     --------
1. Create Booking    →
                     ← 2. Booking Created
3. Create Order      →
                            4. Create Razorpay Order →
                     ← 5. Order Details          ←
6. Open Razorpay Modal
7. User Pays        →       (Direct to Razorpay)  →
                     ← 8. Payment Response      ←
9. Verify Payment   →
                            10. Verify Signature
                     ← 11. Payment Confirmed
12. Update UI
```

## API Endpoints

### Payment Routes

All routes require authentication token in header: `Authorization: Bearer <token>`

#### 1. Create Order

```
POST /api/payment/create-order
```

**Request Body:**

```json
{
  "bookingId": "booking_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "order_xxxxx",
    "amount": 11000,
    "currency": "INR",
    "payment": { ... }
  }
}
```

#### 2. Verify Payment

```
POST /api/payment/verify
```

**Request Body:**

```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "bookingId": "booking_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": { ... },
    "paymentId": "pay_xxxxx"
  }
}
```

#### 3. Get Payment by Booking

```
GET /api/payment/booking/:bookingId
```

**Response:**

```json
{
  "success": true,
  "message": "Payment retrieved",
  "data": { ... }
}
```

#### 4. Initiate Refund

```
POST /api/payment/:paymentId/refund
```

**Request Body:**

```json
{
  "reason": "Service cancellation"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Refund initiated successfully",
  "data": {
    "refund": { ... },
    "payment": { ... }
  }
}
```

## Database Schema

### Payment Model

```javascript
{
  bookingId: ObjectId,           // Reference to Booking
  userId: ObjectId,              // Reference to User
  providerId: ObjectId,          // Reference to Provider
  amount: Number,                // Total amount
  platformFee: Number,           // Platform fee
  providerAmount: Number,        // Amount for provider
  status: String,                // pending | completed | refunded | failed
  paymentMethod: String,         // razorpay
  transactionId: String,         // Razorpay transaction ID
  razorpayOrderId: String,       // Razorpay order ID
  razorpayPaymentId: String,     // Razorpay payment ID
  razorpaySignature: String,     // Payment signature
  refundId: String,              // Refund ID if refunded
  createdAt: Date
}
```

## Testing

### Test Cards (Razorpay Test Mode)

#### Successful Payment

- **Card Number:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

#### Failed Payment

- **Card Number:** 4000 0000 0000 0002

#### UPI Testing

- **UPI ID:** success@razorpay
- **UPI ID (Failed):** failure@razorpay

### Other Payment Methods

Razorpay provides test credentials for:

- NetBanking
- Wallets (Paytm, PhonePe, etc.)
- EMI
- Cardless EMI

Refer to [Razorpay Test Mode Documentation](https://razorpay.com/docs/payments/payments/test-card-details/)

## Currency Configuration

The integration is configured for Indian Rupees (INR). The currency symbol has been updated from $ to ₹ throughout the application.

To change currency:

1. Update `currency: "INR"` in [paymentController.js](Backend/controllers/paymentController.js)
2. Update currency symbols in frontend components
3. Ensure your Razorpay account supports the chosen currency

## Security Best Practices

### Implemented

✅ Server-side signature verification
✅ Environment variables for secrets
✅ Authentication required for all payment endpoints
✅ Booking ownership verification
✅ Amount validation on backend

### Important Notes

- ⚠️ Never expose `RAZORPAY_KEY_SECRET` in frontend
- ⚠️ Always verify payment signature on backend
- ⚠️ Never trust amount from frontend, calculate on backend
- ⚠️ Use HTTPS in production
- ⚠️ Switch to live keys only in production

## Production Deployment

### Pre-deployment Checklist

1. **Switch to Live Keys**
   - Replace test keys with live keys in `.env`
   - Verify account is activated for live mode

2. **Security**
   - Enable HTTPS
   - Set secure CORS origins
   - Validate all inputs
   - Add rate limiting

3. **Testing**
   - Test all payment methods
   - Test refund flow
   - Test error scenarios
   - Verify webhook handling (if implemented)

4. **Monitoring**
   - Set up payment logs
   - Monitor failed transactions
   - Track refund requests
   - Set up alerts for payment issues

## Troubleshooting

### Common Issues

#### 1. "Razorpay is not defined"

**Solution:** Ensure the Razorpay script is loaded before initiating payment. The script is loaded dynamically in `loadRazorpayScript()` function.

#### 2. "Invalid signature"

**Solution:**

- Verify `RAZORPAY_KEY_SECRET` is correct in backend `.env`
- Check if all three parameters (order_id, payment_id, signature) are being sent
- Ensure no extra whitespace in environment variables

#### 3. Payment modal doesn't open

**Solution:**

- Check browser console for errors
- Verify `VITE_RAZORPAY_KEY_ID` is set in frontend `.env`
- Clear browser cache and reload

#### 4. "Order not found" error

**Solution:**

- Verify booking was created successfully
- Check if booking ID is being passed correctly
- Verify user authentication token

### Debug Mode

Enable detailed logs in backend:

```javascript
// In paymentController.js
console.log("Order creation:", order);
console.log("Payment verification:", {
  razorpay_order_id,
  razorpay_payment_id,
});
```

## Webhooks (Future Enhancement)

For production, consider implementing Razorpay webhooks to handle:

- Payment success notifications
- Payment failure tracking
- Automated refund updates
- Dispute notifications

Webhook URL format:

```
POST https://your-domain.com/api/payment/webhook
```

## Support & Resources

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **API Reference:** https://razorpay.com/docs/api/

## Code Structure

### Backend Files

- `controllers/paymentController.js` - Payment logic
- `routes/payment.js` - Payment routes
- `models/Payment.js` - Payment schema

### Frontend Files

- `pages/user/BookingDetails.jsx` - Payment UI
- `services/api.js` - API calls

## Summary

The Razorpay integration is now complete and ready for testing. Follow the setup instructions above, use test credentials for development, and thoroughly test before deploying to production with live keys.

For any issues or questions, refer to the troubleshooting section or Razorpay's official documentation.
