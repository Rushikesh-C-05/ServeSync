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
@Document(collection = "provider_applications")
public class ProviderApplication {
    
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
    
    private String documentsUrl;
    
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    private String adminNotes;
    
    private String rejectionReason;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED;
        
        @com.fasterxml.jackson.annotation.JsonCreator
        public static ApplicationStatus fromString(String value) {
            return ApplicationStatus.valueOf(value.toUpperCase());
        }
    }
}
