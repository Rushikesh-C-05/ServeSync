package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import com.servesync.dto.service.ServiceRequest;
import com.servesync.model.Category;
import com.servesync.model.Provider;
import com.servesync.model.Review;
import com.servesync.model.Service;
import com.servesync.model.User;
import com.servesync.service.CategoryService;
import com.servesync.service.ProviderService;
import com.servesync.service.ReviewService;
import com.servesync.service.ServiceService;
import com.servesync.service.UploadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/service")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private ProviderService providerService;
    
    @Autowired
    private UploadService uploadService;
    
    @Autowired
    private ReviewService reviewService;
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Service>>> getAllServices() {
        try {
            List<Service> services = serviceService.getAvailableServices();
            return ResponseEntity.ok(ApiResponse.success("Services retrieved", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Service>> getServiceById(@PathVariable String id) {
        try {
            Service service = serviceService.getServiceById(id);
            return ResponseEntity.ok(ApiResponse.success("Service retrieved", service));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Service>>> getServicesByCategory(@PathVariable String category) {
        try {
            List<Service> services = serviceService.getServicesByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Services retrieved", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<Service>> createService(
            @AuthenticationPrincipal User user,
            @Valid @RequestPart("data") ServiceRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Provider provider = providerService.getProviderByUserId(user.getId());
            
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                imageUrl = uploadService.uploadImage(image, "servesync/services");
            }
            
            Service service = new Service();
            service.setProviderId(provider.getId());
            service.setName(request.getName());
            service.setDescription(request.getDescription());
            service.setCategory(request.getCategory());
            service.setPrice(request.getPrice());
            service.setDuration(request.getDuration());
            service.setImage(imageUrl);
            
            Service created = serviceService.createService(service);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Service created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<Service>> updateService(
            @PathVariable String id,
            @RequestBody Service updateData) {
        try {
            Service updated = serviceService.updateService(id, updateData);
            return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<String>> deleteService(@PathVariable String id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ApiResponse<Service>> toggleAvailability(@PathVariable String id) {
        try {
            Service service = serviceService.toggleAvailability(id);
            return ResponseEntity.ok(ApiResponse.success("Service availability updated", service));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Service>>> searchServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        try {
            List<Service> services = serviceService.searchServices(keyword, category, minPrice, maxPrice);
            return ResponseEntity.ok(ApiResponse.success("Services retrieved", services));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getServiceReviews(@PathVariable String id) {
        try {
            List<Review> reviews = reviewService.getServiceReviews(id);
            return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Categories retrieved", categories));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
