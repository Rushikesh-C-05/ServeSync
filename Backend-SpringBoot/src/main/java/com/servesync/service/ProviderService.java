package com.servesync.service;

import com.servesync.model.Booking;
import com.servesync.model.Provider;
import com.servesync.model.ProviderApplication;
import com.servesync.model.Review;
import com.servesync.model.User;
import com.servesync.repository.BookingRepository;
import com.servesync.repository.PaymentRepository;
import com.servesync.repository.ProviderApplicationRepository;
import com.servesync.repository.ProviderRepository;
import com.servesync.repository.ReviewRepository;
import com.servesync.repository.ServiceRepository;
import com.servesync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProviderService {
    
    @Autowired
    private ProviderRepository providerRepository;
    
    @Autowired
    private ProviderApplicationRepository applicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public ProviderApplication submitApplication(String userId, ProviderApplication application) {
        if (applicationRepository.existsByUserId(userId)) {
            throw new RuntimeException("You have already submitted an application");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getCanReapply()) {
            throw new RuntimeException("You cannot reapply at this time");
        }
        
        application.setUserId(userId);
        application.setStatus(ProviderApplication.ApplicationStatus.PENDING);
        return applicationRepository.save(application);
    }
    
    public List<ProviderApplication> getPendingApplications() {
        List<ProviderApplication> applications = applicationRepository.findByStatus(ProviderApplication.ApplicationStatus.PENDING);
        
        // Populate user field for each application
        applications.forEach(app -> {
            if (app.getUserId() != null) {
                userRepository.findById(app.getUserId()).ifPresent(app::setUser);
            }
        });
        
        return applications;
    }
    
    public ProviderApplication getApplicationByUserId(String userId) {
        return applicationRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
    
    public Provider approveApplication(String applicationId) {
        ProviderApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        User user = userRepository.findById(application.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update application status
        application.setStatus(ProviderApplication.ApplicationStatus.APPROVED);
        applicationRepository.save(application);
        
        // Update user role
        user.setRole(User.UserRole.PROVIDER);
        user.setProviderRejected(false);
        user.setProviderRejectionReason(null);
        userRepository.save(user);
        
        // Create provider profile
        Provider provider = new Provider();
        provider.setUserId(user.getId());
        provider.setBusinessName(application.getBusinessName());
        provider.setDescription(application.getDescription());
        provider.setCategory(application.getCategory());
        provider.setExperience(application.getExperience());
        provider.setCertifications(application.getCertifications());
        provider.setStatus(Provider.ProviderStatus.APPROVED);
        
        return providerRepository.save(provider);
    }
    
    public void rejectApplication(String applicationId, String reason) {
        ProviderApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        User user = userRepository.findById(application.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update application status
        application.setStatus(ProviderApplication.ApplicationStatus.REJECTED);
        application.setRejectionReason(reason);
        applicationRepository.save(application);
        
        // Update user
        user.setProviderRejected(true);
        user.setProviderRejectionReason(reason);
        user.setCanReapply(true);
        userRepository.save(user);
    }
    
    public Provider getProviderById(String id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        
        // Populate user field
        if (provider.getUserId() != null) {
            userRepository.findById(provider.getUserId()).ifPresent(provider::setUser);
        }
        
        return provider;
    }
    
    public Provider getProviderByUserId(String userId) {
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        
        // Populate user field
        if (provider.getUserId() != null) {
            userRepository.findById(provider.getUserId()).ifPresent(provider::setUser);
        }
        
        return provider;
    }
    
    public List<Provider> getAllProviders() {
        List<Provider> providers = providerRepository.findAll();
        
        // Populate user field for each provider
        providers.forEach(provider -> {
            if (provider.getUserId() != null) {
                userRepository.findById(provider.getUserId()).ifPresent(provider::setUser);
            }
        });
        
        return providers;
    }
    
    public Provider updateProvider(String id, Provider updateData) {
        Provider provider = getProviderById(id);
        
        if (updateData.getBusinessName() != null) {
            provider.setBusinessName(updateData.getBusinessName());
        }
        if (updateData.getDescription() != null) {
            provider.setDescription(updateData.getDescription());
        }
        if (updateData.getCategory() != null) {
            provider.setCategory(updateData.getCategory());
        }
        if (updateData.getExperience() != null) {
            provider.setExperience(updateData.getExperience());
        }
        if (updateData.getCertifications() != null) {
            provider.setCertifications(updateData.getCertifications());
        }
        if (updateData.getProfileImage() != null) {
            provider.setProfileImage(updateData.getProfileImage());
        }
        
        return providerRepository.save(provider);
    }
    
    public Map<String, Object> getDashboardStats(String userId) {
        Provider provider = getProviderByUserId(userId);
        Map<String, Object> stats = new HashMap<>();
        
        // Get all bookings for this provider
        List<Booking> providerBookings = bookingRepository.findByProviderId(provider.getId());
        
        // Get all services for this provider
        List<com.servesync.model.Service> providerServices = serviceRepository.findByProviderId(provider.getId());
        
        // Get all reviews for this provider
        List<Review> providerReviews = reviewRepository.findByProviderId(provider.getId());
        
        // Calculate stats
        long activeBookings = providerBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING || 
                            b.getStatus() == Booking.BookingStatus.ACCEPTED)
                .count();
        
        long completedBookings = providerBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .count();
        
        long pendingRequests = providerBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING)
                .count();
        
        double totalEarnings = providerBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .mapToDouble(Booking::getServiceAmount)
                .sum();
        
        // Calculate average rating
        double rating = 0.0;
        if (!providerReviews.isEmpty()) {
            rating = providerReviews.stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);
        }
        
        // Build stats map
        stats.put("totalServices", providerServices.size());
        stats.put("activeBookings", activeBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("pendingRequests", pendingRequests);
        stats.put("totalEarnings", String.format("%.2f", totalEarnings));
        stats.put("rating", String.format("%.1f", rating));
        stats.put("services", providerServices);
        stats.put("recentBookings", providerBookings.stream().limit(5).toList());
        
        return stats;
    }
    
    public Map<String, Object> getEarnings(String providerId) {
        Map<String, Object> earnings = new HashMap<>();
        
        List<Booking> completedBookings = bookingRepository.findByProviderIdAndStatus(
                providerId, Booking.BookingStatus.COMPLETED);
        
        double totalEarnings = completedBookings.stream()
                .mapToDouble(Booking::getServiceAmount)
                .sum();
        
        earnings.put("totalEarnings", totalEarnings);
        earnings.put("completedBookings", completedBookings.size());
        earnings.put("currency", "INR");
        
        return earnings;
    }
    
    public List<Provider> getPendingProviders() {
        return providerRepository.findByStatus(Provider.ProviderStatus.PENDING);
    }
    
    public Provider approveProvider(String providerId) {
        Provider provider = getProviderById(providerId);
        provider.setStatus(Provider.ProviderStatus.APPROVED);
        return providerRepository.save(provider);
    }
    
    public Provider rejectProvider(String providerId) {
        Provider provider = getProviderById(providerId);
        provider.setStatus(Provider.ProviderStatus.REJECTED);
        return providerRepository.save(provider);
    }
    
    public void deleteProvider(String providerId) {
        providerRepository.deleteById(providerId);
    }
    
    public ProviderApplication getApplicationById(String id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
    
    public Provider approveApplicationWithNotes(String applicationId, String adminNotes) {
        ProviderApplication application = getApplicationById(applicationId);
        application.setAdminNotes(adminNotes);
        return approveApplication(applicationId);
    }
    
    public void rejectApplicationWithNotes(String applicationId, String adminNotes) {
        ProviderApplication application = getApplicationById(applicationId);
        application.setAdminNotes(adminNotes);
        rejectApplication(applicationId, adminNotes);
    }
}
