package com.servesync.dto.user;

import com.servesync.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String phone;
    private String address;
    private User.UserRole role;
    private Boolean isBlocked;
    private Boolean providerRejected;
    private String providerRejectionReason;
    private Boolean canReapply;
    private String profileImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static UserResponse fromUser(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getPhone(),
            user.getAddress(),
            user.getRole(),
            user.getIsBlocked(),
            user.getProviderRejected(),
            user.getProviderRejectionReason(),
            user.getCanReapply(),
            user.getProfileImage(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}
