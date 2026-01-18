# Razorpay Payment Integration - Troubleshooting Guide

## Current Issue: 401 Unauthorized from Razorpay

Your `.env` file shows:
- Key ID: `rzp_test_S5KVlUVhzYVEJE`
- Key Secret: `5nFBRS3bc3v069TX6nFfpMJR`

### Possible Causes:

1. **Invalid or Expired Keys**
   - Razorpay test keys might have expired
   - Keys might have been regenerated in the dashboard

2. **Account Status**
   - Razorpay account might not be activated
   - Account might be suspended

3. **Environment Variables Not Loaded**
   - Backend server needs restart after .env changes
   - Check if dotenv is properly configured

## How to Fix:

### Step 1: Verify Your Razorpay Keys

1. Go to https://dashboard.razorpay.com/
2. Login to your account
3. Navigate to **Settings** > **API Keys**
4. Check if your test keys are still active
5. If needed, click **Regenerate Test Keys**
6. Copy the new **Key ID** and **Key Secret**

### Step 2: Update Your .env File

Update `Backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_NEW_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_NEW_KEY_SECRET
```

### Step 3: Restart Backend Server

```bash
cd Backend
npm run dev
```

### Step 4: Test the Payment

Use these test card details:
- **Card Number**: 4111 1111 1111 1111
- **CVV**: 123
- **Expiry**: 12/25 (any future date)
- **Name**: Test User

## Alternative: Mock Payment for Development

If you don't want to use Razorpay right now, you can temporarily mock the payment:

### Option A: Create Mock Payment Mode

Add to `Backend/.env`:
```env
PAYMENT_MODE=mock
```

### Option B: Use Cash on Delivery

Modify the payment flow to allow "Cash on Delivery" option which skips Razorpay.

## Check Razorpay Account Status

Run this test from Postman or curl:

```bash
curl -u rzp_test_S5KVlUVhzYVEJE:5nFBRS3bc3v069TX6nFfpMJR \
  https://api.razorpay.com/v1/payments
```

If you get 401, the keys are invalid.

## Getting New Razorpay Account (If Needed)

1. Visit https://razorpay.com/
2. Click **Sign Up**
3. Fill in business details
4. Verify email
5. Complete KYC (for test mode, minimal info needed)
6. Go to Settings > API Keys
7. Generate Test Keys
8. Copy Key ID and Key Secret to `.env`

## Need Help?

- Razorpay Support: https://razorpay.com/support/
- Razorpay Docs: https://razorpay.com/docs/
- Test API: https://razorpay.com/docs/payments/payments/test-card-details/

## Current Backend Configuration

Your backend is using:
- File: `Backend/controllers/paymentController.js`
- Razorpay SDK version: Check `Backend/package.json`
- Environment: Test Mode (based on `rzp_test_` prefix)
