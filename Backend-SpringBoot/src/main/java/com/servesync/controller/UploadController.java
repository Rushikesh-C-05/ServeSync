package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.model.Provider;
import com.servesync.model.User;
import com.servesync.repository.ProviderRepository;
import com.servesync.repository.UserRepository;
import com.servesync.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {
    
    @Autowired
    private UploadService uploadService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProviderRepository providerRepository;
    
    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "folder", defaultValue = "servesync") String folder) {
        try {
            String imageUrl = uploadService.uploadImage(image, folder);
            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", 
                    Map.of("url", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/user/profile-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadUserProfileImage(
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            String imageUrl = uploadService.uploadImage(image, "servesync/profiles");
            
            user.setProfileImage(imageUrl);
            userRepository.save(user);
            
            return ResponseEntity.ok(ApiResponse.success("Profile image uploaded successfully", 
                    Map.of("profileImage", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/user/profile-image")
    public ResponseEntity<ApiResponse<String>> deleteUserProfileImage(
            @AuthenticationPrincipal User user) {
        try {
            if (user.getProfileImage() != null) {
                uploadService.deleteImage(user.getProfileImage());
                user.setProfileImage(null);
                userRepository.save(user);
            }
            return ResponseEntity.ok(ApiResponse.success("Profile image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/provider/profile-image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProviderProfileImage(
            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal User user) {
        try {
            // Find provider by userId
            Provider provider = providerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Provider not found"));
            
            String imageUrl = uploadService.uploadImage(image, "servesync/providers");
            
            provider.setProfileImage(imageUrl);
            providerRepository.save(provider);
            
            return ResponseEntity.ok(ApiResponse.success("Provider profile image uploaded successfully", 
                    Map.of("profileImage", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/provider/profile-image")
    public ResponseEntity<ApiResponse<String>> deleteProviderProfileImage(
            @AuthenticationPrincipal User user) {
        try {
            // Find provider by userId
            Provider provider = providerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Provider not found"));
            
            if (provider.getProfileImage() != null) {
                uploadService.deleteImage(provider.getProfileImage());
                provider.setProfileImage(null);
                providerRepository.save(provider);
            }
            return ResponseEntity.ok(ApiResponse.success("Provider profile image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/service/{serviceId}/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadServiceImageWithId(
            @PathVariable String serviceId,
            @RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = uploadService.uploadImage(image, "servesync/services");
            return ResponseEntity.ok(ApiResponse.success("Service image uploaded successfully", 
                    Map.of("url", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/service/{serviceId}/image")
    public ResponseEntity<ApiResponse<String>> deleteServiceImageWithId(
            @PathVariable String serviceId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Service image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/admin/service/{serviceId}/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> adminUploadServiceImage(
            @PathVariable String serviceId,
            @RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = uploadService.uploadImage(image, "servesync/services");
            return ResponseEntity.ok(ApiResponse.success("Service image uploaded successfully", 
                    Map.of("url", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/service/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadServiceImage(
            @RequestParam("image") MultipartFile image) {
        try {
            String imageUrl = uploadService.uploadImage(image, "servesync/services");
            return ResponseEntity.ok(ApiResponse.success("Service image uploaded successfully", 
                    Map.of("url", imageUrl)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/image")
    public ResponseEntity<ApiResponse<String>> deleteImage(@RequestBody Map<String, String> body) {
        try {
            String imageUrl = body.get("imageUrl");
            uploadService.deleteImage(imageUrl);
            return ResponseEntity.ok(ApiResponse.success("Image deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
