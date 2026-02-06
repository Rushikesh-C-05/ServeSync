package com.servesync.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    private String name;
    
    private String phone;
    
    private String address;
    
    private UserRole role = UserRole.USER;
    
    private Boolean isBlocked = false;
    
    private Boolean providerRejected = false;
    
    private String providerRejectionReason;
    
    private Boolean canReapply = true;
    
    private String profileImage;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum UserRole {
        USER, PROVIDER, ADMIN;
        
        @JsonCreator
        public static UserRole fromString(String value) {
            if (value == null) {
                return USER;
            }
            return UserRole.valueOf(value.toUpperCase());
        }
    }
}
