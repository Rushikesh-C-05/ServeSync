package com.servesync.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "services")
public class Service {
    
    @Id
    private String id;
    
    @DBRef
    private Provider provider;
    
    private String providerId;
    
    private String name;
    
    private String description;
    
    private String category;
    
    private Double price;
    
    private Integer duration;
    
    private String location;
    
    private Boolean isAvailable = true;
    
    private Double rating = 0.0;
    
    private Integer reviewCount = 0;
    
    private Integer totalBookings = 0;
    
    private String image;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
