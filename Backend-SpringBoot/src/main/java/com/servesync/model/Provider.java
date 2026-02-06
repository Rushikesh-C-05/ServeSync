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
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "providers")
public class Provider {
    
    @Id
    private String id;
    
    @DBRef
    private User user;
    
    private String userId;
    
    private String businessName;
    
    private String description;
    
    private String category;
    
    private Integer experience;
    
    private List<String> certifications;
    
    private ProviderStatus status = ProviderStatus.PENDING;
    
    private Double rating = 0.0;
    
    private Integer totalReviews = 0;
    
    private Double totalEarnings = 0.0;
    
    private String profileImage;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum ProviderStatus {
        PENDING, APPROVED, REJECTED;
        
        @com.fasterxml.jackson.annotation.JsonCreator
        public static ProviderStatus fromString(String value) {
            return ProviderStatus.valueOf(value.toUpperCase());
        }
    }
}
