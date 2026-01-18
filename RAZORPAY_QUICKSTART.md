# Razorpay Integration - Quick Start

## 🚀 Quick Setup (5 minutes)

### 1. Get Razorpay Test Keys

1. Go to https://dashboard.razorpay.com/
2. Switch to **Test Mode** (top right)
3. Go to Settings → API Keys
4. Copy **Key ID** and **Key Secret**

### 2. Configure Backend

```bash
cd Backend
cp .env.example .env
# Edit .env and add:
# RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
# RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
npm run dev
```

### 3. Configure Frontend

```bash
cd Frontend
cp .env.example .env
# Edit .env and add:
# VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
npm run dev
```

### 4. Test Payment

1. Login as a user
2. Browse services
3. Click on any service
4. Fill booking details (date, time, address)
5. Click "Proceed to Payment"
6. Use test card: **4111 1111 1111 1111**
7. CVV: Any 3 digits, Expiry: Any future date

## 🧪 Test Credentials

### Successful Payment

- **Card:** 4111 1111 1111 1111
- **CVV:** 123
- **Expiry:** 12/25

### Failed Payment

- **Card:** 4000 0000 0000 0002

### UPI

- **Success:** success@razorpay
- **Failed:** failure@razorpay

## 📱 Payment Flow

```
User → Select Service → Book → Pay with Razorpay → Success → Booking Confirmed
```

## 🔑 Key Features

✅ Secure payment processing
✅ Multiple payment methods (Cards, UPI, Netbanking, Wallets)
✅ Automatic payment verification
✅ Refund support
✅ Booking-payment linkage

## 📝 Important Notes

- Use **Test Mode** keys for development
- Never commit `.env` files
- Test thoroughly before going live
- Switch to **Live Mode** keys for production

## 🆘 Quick Troubleshooting

**Payment modal not opening?**

- Check if Razorpay Key ID is set in frontend `.env`
- Clear browser cache

**Invalid signature error?**

- Verify Key Secret in backend `.env`
- No extra spaces in environment variables

**Booking created but payment fails?**

- Check browser console for errors
- Verify backend is running on port 8080

## 📚 Full Documentation

See [RAZORPAY_INTEGRATION.md](RAZORPAY_INTEGRATION.md) for complete documentation.
