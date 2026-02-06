package com.servesync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    
    @Id
    private String id;
    
    @DBRef
    private Booking booking;
    
    @DBRef
    private User user;
    
    @DBRef
    private Provider provider;
    
    private String bookingId;
    
    private String userId;
    
    private String providerId;
    
    private Double amount;
    
    private Double platformFee;
    
    private Double providerAmount;
    
    private PaymentStatus status = PaymentStatus.PENDING;
    
    private String paymentMethod = "razorpay";
    
    private String transactionId;
    
    private String razorpayOrderId;
    
    private String razorpayPaymentId;
    
    private String razorpaySignature;
    
    private String refundId;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    public enum PaymentStatus {
        PENDING, COMPLETED, REFUNDED, FAILED;
        
        @com.fasterxml.jackson.annotation.JsonCreator
        public static PaymentStatus fromString(String value) {
            return PaymentStatus.valueOf(value.toUpperCase());
        }
    }
}
