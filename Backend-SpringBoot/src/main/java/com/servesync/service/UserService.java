package com.servesync.service;

import com.servesync.model.ProviderApplication;
import com.servesync.model.User;
import com.servesync.repository.ProviderApplicationRepository;
import com.servesync.repository.UserRepository;
import com.servesync.repository.BookingRepository;
import com.servesync.repository.PaymentRepository;
import com.servesync.repository.ServiceRepository;
import com.servesync.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ProviderApplicationRepository providerApplicationRepository;
    
    public Map<String, Object> getDashboardStats(String userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get user bookings
        List<Booking> userBookings = bookingRepository.findByUserId(userId);
        
        // Calculate stats
        long activeBookings = userBookings.stream()
            .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING || 
                        b.getStatus() == Booking.BookingStatus.ACCEPTED)
            .count();
            
        long completedBookings = userBookings.stream()
            .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
            .count();
            
        double totalSpent = userBookings.stream()
            .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
            .mapToDouble(Booking::getTotalAmount)
            .sum();
        
        stats.put("activeBookings", activeBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("totalSpent", String.format("%.2f", totalSpent));
        stats.put("featuredServices", List.of()); // Will be populated from ServiceService
        stats.put("recentBookings", userBookings.stream().limit(5).toList());
        
        return stats;
    }
    
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUser(String id, User updateData) {
        User user = getUserById(id);
        
        if (updateData.getName() != null) {
            user.setName(updateData.getName());
        }
        if (updateData.getPhone() != null) {
            user.setPhone(updateData.getPhone());
        }
        if (updateData.getAddress() != null) {
            user.setAddress(updateData.getAddress());
        }
        if (updateData.getProfileImage() != null) {
            user.setProfileImage(updateData.getProfileImage());
        }
        
        return userRepository.save(user);
    }
    
    public User changePassword(String id, String currentPassword, String newPassword) {
        User user = getUserById(id);
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }
    
    public User toggleBlockUser(String id) {
        User user = getUserById(id);
        user.setIsBlocked(!user.getIsBlocked());
        return userRepository.save(user);
    }
    
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
    
    public User resetProviderRejection(String userId) {
        User user = getUserById(userId);
        user.setProviderRejected(false);
        user.setProviderRejectionReason(null);
        user.setCanReapply(true);
        return userRepository.save(user);
    }
    
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalProviders = userRepository.findByRole(User.UserRole.PROVIDER).size();
        long totalBookings = bookingRepository.count();
        long totalServices = serviceRepository.count();
        
        List<Booking> pendingBookings = bookingRepository.findByStatus(Booking.BookingStatus.PENDING);
        List<ProviderApplication> pendingApplications = providerApplicationRepository.findByStatus(ProviderApplication.ApplicationStatus.PENDING);
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalProviders", totalProviders);
        stats.put("totalBookings", totalBookings);
        stats.put("totalServices", totalServices);
        stats.put("pendingBookings", pendingBookings.size());
        stats.put("pendingApplications", pendingApplications.size());
        
        return stats;
    }
    
    public Map<String, Object> getPlatformEarnings() {
        Map<String, Object> earnings = new HashMap<>();
        
        double totalEarnings = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == com.servesync.model.Payment.PaymentStatus.COMPLETED)
                .mapToDouble(com.servesync.model.Payment::getPlatformFee)
                .sum();
        
        earnings.put("totalEarnings", totalEarnings);
        earnings.put("currency", "INR");
        
        return earnings;
    }
    
    public void updatePlatformFee(Double percentage) {
        // Store platform fee configuration
        // Note: This should be stored in a settings/configuration collection in the database
        // For now, this is a placeholder - implementation should store in PlatformConfig collection
        if (percentage == null || percentage < 0 || percentage > 100) {
            throw new RuntimeException("Invalid platform fee percentage");
        }
        // TODO: Implement PlatformConfig storage when needed
        // Example: platformConfigRepository.save(new PlatformConfig("platformFee", percentage));
    }
    
    public ProviderApplication submitProviderApplication(String userId, ProviderApplication applicationData) {
        if (providerApplicationRepository.existsByUserId(userId)) {
            throw new RuntimeException("You have already submitted an application");
        }
        
        User user = getUserById(userId);
        
        if (!user.getCanReapply()) {
            throw new RuntimeException("You cannot reapply at this time");
        }
        
        applicationData.setUserId(userId);
        applicationData.setStatus(ProviderApplication.ApplicationStatus.PENDING);
        
        return providerApplicationRepository.save(applicationData);
    }
    
    public ProviderApplication getProviderApplicationStatus(String userId) {
        ProviderApplication application = providerApplicationRepository.findByUserId(userId)
                .orElse(null);
        
        // Populate user field if application exists
        if (application != null && application.getUserId() != null) {
            userRepository.findById(application.getUserId()).ifPresent(application::setUser);
        }
        
        return application;
    }
}
