package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.model.Booking;
import com.servesync.model.Review;
import com.servesync.model.User;
import com.servesync.model.ProviderApplication;
import com.servesync.service.BookingService;
import com.servesync.service.ReviewService;
import com.servesync.service.UserService;
import com.servesync.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/{userId}")
public class UserProfileController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UploadService uploadService;
    
    // Profile endpoints
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            User userData = userService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved", userData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @PathVariable String userId,
            @AuthenticationPrincipal User user,
            @RequestBody User updateData) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            User updatedUser = userService.updateUser(userId, updateData);
            return ResponseEntity.ok(ApiResponse.success("Profile updated", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Map<String, Object> dashboardData = userService.getDashboardStats(userId);
            return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved", dashboardData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Booking endpoints
    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<Booking>> bookService(
            @PathVariable String userId,
            @AuthenticationPrincipal User user,
            @RequestBody Booking bookingData) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Booking booking = bookingService.createBooking(userId, bookingData);
            return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            List<Booking> bookings = bookingService.getUserBookings(userId);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> getBookingDetails(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Booking booking = bookingService.getBookingById(bookingId);
            
            if (!booking.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            return ResponseEntity.ok(ApiResponse.success("Booking details retrieved", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Booking booking = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Review endpoints
    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<Review>> submitReview(
            @PathVariable String userId,
            @AuthenticationPrincipal User user,
            @RequestBody Review reviewData) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Review review = reviewService.submitReview(userId, reviewData);
            return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getMyReviews(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            List<Review> reviews = reviewService.getUserReviews(userId);
            return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/bookings/{bookingId}/can-review")
    public ResponseEntity<ApiResponse<Map<String, Object>>> canReviewBooking(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Map<String, Object> result = reviewService.canReviewBooking(userId, bookingId);
            return ResponseEntity.ok(ApiResponse.success("Check completed", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Provider application endpoints
    @PostMapping(value = "/provider-application", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProviderApplication>> submitProviderApplication(
            @PathVariable String userId,
            @AuthenticationPrincipal User user,
            @RequestParam(value = "businessName", required = false) String businessName,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "businessDescription", required = false) String businessDescription,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "experience", required = false) String experienceStr,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "certifications", required = false) String certifications,
            @RequestParam(value = "portfolio", required = false) String portfolio,
            @RequestParam(value = "businessImage", required = false) MultipartFile businessImage) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            String imageUrl = null;
            if (businessImage != null && !businessImage.isEmpty()) {
                imageUrl = uploadService.uploadImage(businessImage, "servesync/provider-applications");
            }
            
            // Use businessDescription if description is not provided
            String finalDescription = description != null ? description : businessDescription;
            
            // Parse experience
            Integer experience = null;
            if (experienceStr != null && !experienceStr.isEmpty()) {
                try {
                    experience = Integer.parseInt(experienceStr);
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("Invalid experience value"));
                }
            }
            
            ProviderApplication applicationData = new ProviderApplication();
            applicationData.setBusinessName(businessName);
            applicationData.setDescription(finalDescription);
            applicationData.setCategory(category);
            applicationData.setExperience(experience);
            applicationData.setDocumentsUrl(imageUrl);
            
            if (certifications != null && !certifications.isEmpty()) {
                applicationData.setCertifications(List.of(certifications.split(",")));
            }
            
            ProviderApplication application = userService.submitProviderApplication(userId, applicationData);
            return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", application));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/provider-application/status")
    public ResponseEntity<ApiResponse<ProviderApplication>> getProviderApplicationStatus(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            ProviderApplication application = userService.getProviderApplicationStatus(userId);
            return ResponseEntity.ok(ApiResponse.success("Application status retrieved", application));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
