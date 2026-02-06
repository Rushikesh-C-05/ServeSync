package com.servesync.repository;

import com.servesync.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    List<Booking> findByUserId(String userId);
    
    List<Booking> findByProviderId(String providerId);
    
    List<Booking> findByServiceId(String serviceId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByUserIdAndStatus(String userId, Booking.BookingStatus status);
    
    List<Booking> findByProviderIdAndStatus(String providerId, Booking.BookingStatus status);
}
