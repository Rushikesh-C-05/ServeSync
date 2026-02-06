package com.servesync.service;

import com.servesync.dto.auth.AuthResponse;
import com.servesync.dto.auth.LoginRequest;
import com.servesync.dto.auth.RegisterRequest;
import com.servesync.dto.user.UserResponse;
import com.servesync.model.User;
import com.servesync.repository.UserRepository;
import com.servesync.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    public UserResponse register(RegisterRequest request, String profileImageUrl) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(User.UserRole.USER);
        user.setProfileImage(profileImageUrl);
        
        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
    
    public AuthResponse login(LoginRequest request, User.UserRole expectedRole) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        // For user login, allow both USER and PROVIDER roles
        if (expectedRole == User.UserRole.USER) {
            if (user.getRole() != User.UserRole.USER && user.getRole() != User.UserRole.PROVIDER) {
                throw new RuntimeException("Invalid credentials");
            }
        } else {
            // For provider and admin login, role must match exactly
            if (user.getRole() != expectedRole) {
                throw new RuntimeException("Invalid credentials");
            }
        }
        
        if (user.getIsBlocked()) {
            throw new RuntimeException("Your account has been blocked");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = tokenProvider.generateToken(user.getId());
        UserResponse userResponse = UserResponse.fromUser(user);
        
        return new AuthResponse(token, userResponse);
    }
}
