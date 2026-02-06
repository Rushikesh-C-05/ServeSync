package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.dto.auth.AuthResponse;
import com.servesync.dto.auth.LoginRequest;
import com.servesync.dto.auth.RegisterRequest;
import com.servesync.dto.user.UserResponse;
import com.servesync.model.User;
import com.servesync.service.AuthService;
import com.servesync.service.UploadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UploadService uploadService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("name") String name,
            @RequestParam("phone") String phone,
            @RequestParam("address") String address,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            RegisterRequest request = new RegisterRequest();
            request.setEmail(email);
            request.setPassword(password);
            request.setName(name);
            request.setPhone(phone);
            request.setAddress(address);
            
            String imageUrl = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                imageUrl = uploadService.uploadImage(profileImage, "servesync/profiles");
            }
            
            UserResponse user = authService.register(request, imageUrl);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login/user")
    public ResponseEntity<ApiResponse<AuthResponse>> userLogin(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request, User.UserRole.USER);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login/provider")
    public ResponseEntity<ApiResponse<AuthResponse>> providerLogin(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request, User.UserRole.PROVIDER);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/login/admin")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request, User.UserRole.ADMIN);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
