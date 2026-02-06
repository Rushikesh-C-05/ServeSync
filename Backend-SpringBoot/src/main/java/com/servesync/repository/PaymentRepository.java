package com.servesync.repository;

import com.servesync.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    
    Optional<Payment> findByBookingId(String bookingId);
    
    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    
    List<Payment> findByUserId(String userId);
    
    List<Payment> findByProviderId(String providerId);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
}
