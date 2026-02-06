package com.servesync.repository;

import com.servesync.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    List<Review> findByServiceId(String serviceId);
    
    List<Review> findByProviderId(String providerId);
    
    List<Review> findByUserId(String userId);
    
    Optional<Review> findByBookingId(String bookingId);
    
    Boolean existsByBookingId(String bookingId);
}
