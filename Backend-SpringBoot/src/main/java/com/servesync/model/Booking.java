package com.servesync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    @DBRef
    private Service service;
    
    @DBRef
    private Provider provider;
    
    private String userId;
    
    private String serviceId;
    
    private String providerId;
    
    private LocalDate bookingDate;
    
    private String bookingTime;
    
    private BookingStatus status = BookingStatus.PENDING;
    
    private String userAddress;
    
    private String notes;
    
    private Double serviceAmount;
    
    private Double platformFee;
    
    private Double totalAmount;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum BookingStatus {
        PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED;
        
        @com.fasterxml.jackson.annotation.JsonCreator
        public static BookingStatus fromString(String value) {
            return BookingStatus.valueOf(value.toUpperCase());
        }
    }
}
