package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.dto.user.UserResponse;
import com.servesync.model.*;
import com.servesync.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ProviderService providerService;
    
    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(ApiResponse.success("Admin API is working", "Test successful"));
    }
    
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            List<UserResponse> userResponses = users.stream()
                    .map(UserResponse::fromUser)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success("Users retrieved", userResponses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/users/{id}/toggle-block")
    public ResponseEntity<ApiResponse<UserResponse>> toggleBlockUser(@PathVariable String id) {
        try {
            User user = userService.toggleBlockUser(id);
            return ResponseEntity.ok(ApiResponse.success("User status updated", UserResponse.fromUser(user)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<Provider>>> getAllProviders() {
        try {
            List<Provider> providers = providerService.getAllProviders();
            return ResponseEntity.ok(ApiResponse.success("Providers retrieved", providers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/provider-applications")
    public ResponseEntity<ApiResponse<List<ProviderApplication>>> getPendingApplications() {
        try {
            List<ProviderApplication> applications = providerService.getPendingApplications();
            return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/provider-applications/{id}/approve")
    public ResponseEntity<ApiResponse<Provider>> approveApplication(@PathVariable String id) {
        try {
            Provider provider = providerService.approveApplication(id);
            return ResponseEntity.ok(ApiResponse.success("Application approved successfully", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/provider-applications/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectApplication(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            String reason = body.get("reason");
            providerService.rejectApplication(id, reason);
            return ResponseEntity.ok(ApiResponse.success("Application rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = userService.getAdminDashboardStats();
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // User management
    @PutMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable String userId,
            @RequestBody User updateData) {
        try {
            User user = userService.updateUser(userId, updateData);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/users/{userId}/reset-rejection")
    public ResponseEntity<ApiResponse<User>> resetProviderRejection(@PathVariable String userId) {
        try {
            User user = userService.resetProviderRejection(userId);
            return ResponseEntity.ok(ApiResponse.success("Provider rejection reset", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Provider management
    @GetMapping("/providers/pending")
    public ResponseEntity<ApiResponse<List<Provider>>> getPendingProviders() {
        try {
            List<Provider> providers = providerService.getPendingProviders();
            return ResponseEntity.ok(ApiResponse.success("Pending providers retrieved", providers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/providers/{providerId}")
    public ResponseEntity<ApiResponse<Provider>> updateProvider(
            @PathVariable String providerId,
            @RequestBody Provider updateData) {
        try {
            Provider provider = providerService.updateProvider(providerId, updateData);
            return ResponseEntity.ok(ApiResponse.success("Provider updated successfully", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/providers/{providerId}/approve")
    public ResponseEntity<ApiResponse<Provider>> approveProvider(@PathVariable String providerId) {
        try {
            Provider provider = providerService.approveProvider(providerId);
            return ResponseEntity.ok(ApiResponse.success("Provider approved successfully", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/providers/{providerId}/reject")
    public ResponseEntity<ApiResponse<Provider>> rejectProvider(@PathVariable String providerId) {
        try {
            Provider provider = providerService.rejectProvider(providerId);
            return ResponseEntity.ok(ApiResponse.success("Provider rejected successfully", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/providers/{providerId}")
    public ResponseEntity<ApiResponse<String>> deleteProvider(@PathVariable String providerId) {
        try {
            providerService.deleteProvider(providerId);
            return ResponseEntity.ok(ApiResponse.success("Provider deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Service management
    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<Service>>> getAllServices() {
        try {
            List<Service> services = serviceService.getAllServices();
            return ResponseEntity.ok(ApiResponse.success("Services retrieved", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<Service>> updateService(
            @PathVariable String serviceId,
            @RequestBody Service updateData) {
        try {
            Service service = serviceService.updateService(serviceId, updateData);
            return ResponseEntity.ok(ApiResponse.success("Service updated successfully", service));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<String>> deleteService(@PathVariable String serviceId) {
        try {
            serviceService.deleteService(serviceId);
            return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Booking management
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> updateBooking(
            @PathVariable String bookingId,
            @RequestBody Booking updateData) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            // Update fields from updateData
            if (updateData.getStatus() != null) {
                booking.setStatus(updateData.getStatus());
            }
            // Save and return
            return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse<Booking>> updateBookingStatus(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status);
            Booking booking = bookingService.updateBookingStatus(bookingId, bookingStatus);
            return ResponseEntity.ok(ApiResponse.success("Booking status updated", booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<String>> deleteBooking(@PathVariable String bookingId) {
        try {
            bookingService.deleteBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Payment management
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        try {
            List<Payment> payments = paymentService.getAllPayments();
            return ResponseEntity.ok(ApiResponse.success("Payments retrieved", payments));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/earnings")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformEarnings() {
        try {
            Map<String, Object> earnings = userService.getPlatformEarnings();
            return ResponseEntity.ok(ApiResponse.success("Platform earnings retrieved", earnings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/platform-fee")
    public ResponseEntity<ApiResponse<String>> updatePlatformFee(@RequestBody Map<String, Double> request) {
        try {
            Double percentage = request.get("percentage");
            userService.updatePlatformFee(percentage);
            return ResponseEntity.ok(ApiResponse.success("Platform fee updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Review management
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllReviews() {
        try {
            Map<String, Object> reviewData = reviewService.getAllReviewsWithStats();
            return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviewData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/reviews/{reviewId}/toggle-visibility")
    public ResponseEntity<ApiResponse<Review>> toggleReviewVisibility(@PathVariable String reviewId) {
        try {
            Review review = reviewService.toggleReviewVisibility(reviewId);
            return ResponseEntity.ok(ApiResponse.success("Review visibility toggled", review));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable String reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Category management
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> addCategory(@RequestBody Map<String, String> request) {
        try {
            String category = request.get("category");
            categoryService.addCategory(category);
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Category added successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> updateCategory(@RequestBody Map<String, String> request) {
        try {
            String oldCategory = request.get("oldCategory");
            String newCategory = request.get("newCategory");
            categoryService.updateCategory(oldCategory, newCategory);
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Category updated successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> deleteCategory(@RequestBody Map<String, String> request) {
        try {
            String category = request.get("category");
            categoryService.deleteCategory(category);
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Provider application management
    @GetMapping("/provider-applications/{id}")
    public ResponseEntity<ApiResponse<ProviderApplication>> getProviderApplication(@PathVariable String id) {
        try {
            ProviderApplication application = providerService.getApplicationById(id);
            return ResponseEntity.ok(ApiResponse.success("Application retrieved", application));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/provider-applications/{id}/approve")
    public ResponseEntity<ApiResponse<Provider>> approveProviderApplication(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String adminNotes = request.get("adminNotes");
            Provider provider = providerService.approveApplicationWithNotes(id, adminNotes);
            return ResponseEntity.ok(ApiResponse.success("Application approved successfully", provider));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/provider-applications/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectProviderApplication(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String adminNotes = request.get("adminNotes");
            providerService.rejectApplicationWithNotes(id, adminNotes);
            return ResponseEntity.ok(ApiResponse.success("Application rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
