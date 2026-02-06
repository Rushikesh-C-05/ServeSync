package com.servesync.service;

import com.servesync.model.Booking;
import com.servesync.model.Payment;
import com.servesync.repository.BookingRepository;
import com.servesync.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Value("${razorpay.key-id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;
    
    public Payment createOrder(String bookingId) throws RazorpayException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Check if payment already exists
        if (paymentRepository.findByBookingId(bookingId).isPresent()) {
            throw new RuntimeException("Payment already exists for this booking");
        }
        
        // Create Razorpay order
        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (booking.getTotalAmount() * 100)); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + bookingId);
        
        Order order = razorpay.orders.create(orderRequest);
        
        // Create payment record
        Payment payment = new Payment();
        payment.setBookingId(bookingId);
        payment.setUserId(booking.getUserId());
        payment.setProviderId(booking.getProviderId());
        payment.setAmount(booking.getTotalAmount());
        payment.setPlatformFee(booking.getPlatformFee());
        payment.setProviderAmount(booking.getServiceAmount());
        payment.setRazorpayOrderId(order.get("id"));
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        
        return paymentRepository.save(payment);
    }
    
    public Payment verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) throws RazorpayException {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        // Verify signature
        JSONObject options = new JSONObject();
        options.put("razorpay_order_id", razorpayOrderId);
        options.put("razorpay_payment_id", razorpayPaymentId);
        options.put("razorpay_signature", razorpaySignature);
        
        boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
        
        if (!isValid) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new RuntimeException("Payment verification failed");
        }
        
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        
        // Update booking status to ACCEPTED after successful payment
        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.ACCEPTED);
        bookingRepository.save(booking);
        
        return paymentRepository.save(payment);
    }
    
    public Payment getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
    
    public Payment getPaymentByBooking(String bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking"));
    }
    
    public Payment initiateRefund(String paymentId, String reason) {
        Payment payment = getPaymentById(paymentId);
        
        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Can only refund completed payments");
        }
        
        // TODO: Implement actual Razorpay refund API call
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        
        return paymentRepository.save(payment);
    }
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
