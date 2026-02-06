package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.model.*;
import com.servesync.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider/{userId}")
public class ProviderProfileController {
    
    @Autowired
    private ProviderService providerService;
    
    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private UploadService uploadService;
    
    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Map<String, Object> dashboardData = providerService.getDashboardStats(userId);
            return ResponseEntity.ok(ApiResponse.success("Dashboard data retrieved", dashboardData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Provider>> getProfile(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Provider provider = providerService.getProviderByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Service management
    @PostMapping("/services")
    public ResponseEntity<ApiResponse<Service>> createService(
            @PathVariable String userId,
            @AuthenticationPrincipal User user,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam("duration") Integer duration,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Provider provider = providerService.getProviderByUserId(userId);
            
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = uploadService.uploadImage(image, "servesync/services");
            }
            
            Service service = new Service();
            service.setProviderId(provider.getId());
            service.setName(name);
            service.setDescription(description);
            service.setCategory(category);
            service.setPrice(price);
            service.setDuration(duration);
            service.setLocation(location);
            service.setImage(imageUrl);
            
            Service created = serviceService.createService(service);
            return ResponseEntity.ok(ApiResponse.success("Service created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<Service>>> getMyServices(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Provider provider = providerService.getProviderByUserId(userId);
            List<Service> services = serviceService.getServicesByProvider(provider.getId());
            return ResponseEntity.ok(ApiResponse.success("Services retrieved", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<Service>> updateService(
            @PathVariable String userId,
            @PathVariable String serviceId,
            @AuthenticationPrincipal User user,
            @RequestBody Service updateData) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Service updated = serviceService.updateService(serviceId, updateData);
            return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<String>> deleteService(
            @PathVariable String userId,
            @PathVariable String serviceId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            serviceService.deleteService(serviceId);
            return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/services/{serviceId}/toggle")
    public ResponseEntity<ApiResponse<Service>> toggleAvailability(
            @PathVariable String userId,
            @PathVariable String serviceId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Service service = serviceService.toggleAvailability(serviceId);
            return ResponseEntity.ok(ApiResponse.success("Service availability updated", service));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Booking management
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingRequests(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Provider provider = providerService.getProviderByUserId(userId);
            List<Booking> bookings = bookingService.getProviderBookings(provider.getId());
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<ApiResponse<Booking>> acceptBooking(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Booking booking = bookingService.acceptBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Booking accepted successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/bookings/{bookingId}/reject")
    public ResponseEntity<ApiResponse<Booking>> rejectBooking(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Booking booking = bookingService.rejectBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/bookings/{bookingId}/complete")
    public ResponseEntity<ApiResponse<Booking>> completeBooking(
            @PathVariable String userId,
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Booking booking = bookingService.completeBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Booking completed successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Reviews
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getReviews(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Provider provider = providerService.getProviderByUserId(userId);
            List<Review> reviews = reviewService.getProviderReviews(provider.getId());
            return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/reviews/{reviewId}/respond")
    public ResponseEntity<ApiResponse<Review>> respondToReview(
            @PathVariable String userId,
            @PathVariable String reviewId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            String response = request.get("response");
            Review review = reviewService.addProviderResponse(reviewId, response);
            return ResponseEntity.ok(ApiResponse.success("Response added successfully", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Earnings
    @GetMapping("/earnings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEarnings(
            @PathVariable String userId,
            @AuthenticationPrincipal User user) {
        try {
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
            }
            
            Provider provider = providerService.getProviderByUserId(userId);
            Map<String, Object> earnings = providerService.getEarnings(provider.getId());
            return ResponseEntity.ok(ApiResponse.success("Earnings retrieved", earnings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
