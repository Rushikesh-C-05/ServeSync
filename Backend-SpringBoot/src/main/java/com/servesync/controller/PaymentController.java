package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.model.Payment;
import com.servesync.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @Value("${razorpay.key-id}")
    private String razorpayKeyId;
    
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(@RequestBody Map<String, String> request) {
        try {
            String bookingId = request.get("bookingId");
            Payment payment = paymentService.createOrder(bookingId);
            
            // Prepare response with Razorpay order details
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("keyId", razorpayKeyId);
            orderData.put("orderId", payment.getRazorpayOrderId());
            orderData.put("amount", (int)(payment.getAmount() * 100)); // Amount in paise
            orderData.put("currency", "INR");
            orderData.put("paymentId", payment.getId());
            
            return ResponseEntity.ok(ApiResponse.success("Payment order created successfully", orderData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Payment>> verifyPayment(@RequestBody Map<String, String> paymentData) {
        try {
            String razorpayOrderId = paymentData.get("razorpay_order_id");
            String razorpayPaymentId = paymentData.get("razorpay_payment_id");
            String razorpaySignature = paymentData.get("razorpay_signature");
            
            Payment payment = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentDetails(@PathVariable String paymentId) {
        try {
            Payment payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(ApiResponse.success("Payment details retrieved", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentByBooking(@PathVariable String bookingId) {
        try {
            Payment payment = paymentService.getPaymentByBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Payment details retrieved", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<Payment>> initiateRefund(
            @PathVariable String paymentId,
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            Payment payment = paymentService.initiateRefund(paymentId, reason);
            return ResponseEntity.ok(ApiResponse.success("Refund initiated successfully", payment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
