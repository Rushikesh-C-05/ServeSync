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
@Document(collection = "reviews")
public class Review {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    @DBRef
    private Service service;
    
    @DBRef
    private Provider provider;
    
    @DBRef
    private Booking booking;
    
    private String userId;
    
    private String serviceId;
    
    private String providerId;
    
    private String bookingId;
    
    private Integer rating;
    
    private String comment;
    
    private String providerResponse;
    
    private Boolean visible = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
