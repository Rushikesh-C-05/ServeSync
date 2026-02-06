package com.servesync.service;

import com.servesync.model.Booking;
import com.servesync.model.Review;
import com.servesync.repository.BookingRepository;
import com.servesync.repository.ProviderRepository;
import com.servesync.repository.ReviewRepository;
import com.servesync.repository.ServiceRepository;
import com.servesync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ProviderRepository providerRepository;
    
    private void populateReview(Review review) {
        if (review.getUserId() != null) {
            userRepository.findById(review.getUserId()).ifPresent(review::setUser);
        }
        if (review.getServiceId() != null) {
            serviceRepository.findById(review.getServiceId()).ifPresent(review::setService);
        }
        if (review.getProviderId() != null) {
            providerRepository.findById(review.getProviderId()).ifPresent(review::setProvider);
        }
        if (review.getBookingId() != null) {
            bookingRepository.findById(review.getBookingId()).ifPresent(review::setBooking);
        }
    }
    
    public Review submitReview(String userId, Review review) {
        // Validate booking exists and belongs to user
        Booking booking = bookingRepository.findById(review.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to review this booking");
        }
        
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Can only review completed bookings");
        }
        
        // Check if review already exists
        if (reviewRepository.existsByBookingId(review.getBookingId())) {
            throw new RuntimeException("You have already reviewed this booking");
        }
        
        review.setUserId(userId);
        review.setServiceId(booking.getServiceId());
        review.setProviderId(booking.getProviderId());
        review.setCreatedAt(LocalDateTime.now());
        
        Review savedReview = reviewRepository.save(review);
        
        // Update service rating and review count
        updateServiceRating(booking.getServiceId());
        
        return savedReview;
    }
    
    private void updateServiceRating(String serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);
        
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            
            serviceRepository.findById(serviceId).ifPresent(service -> {
                service.setRating(Math.round(averageRating * 10.0) / 10.0); // Round to 1 decimal
                service.setReviewCount(reviews.size());
                serviceRepository.save(service);
            });
        }
    }
    
    public List<Review> getUserReviews(String userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        reviews.forEach(this::populateReview);
        return reviews;
    }
    
    public List<Review> getServiceReviews(String serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);
        reviews.forEach(this::populateReview);
        return reviews;
    }
    
    public List<Review> getProviderReviews(String providerId) {
        List<Review> reviews = reviewRepository.findByProviderId(providerId);
        reviews.forEach(this::populateReview);
        return reviews;
    }
    
    public Review addProviderResponse(String reviewId, String response) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setProviderResponse(response);
        return reviewRepository.save(review);
    }
    
    public Map<String, Object> canReviewBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        boolean canReview = booking.getUserId().equals(userId) &&
                           booking.getStatus() == Booking.BookingStatus.COMPLETED &&
                           !reviewRepository.existsByBookingId(bookingId);
        
        return Map.of("canReview", canReview);
    }
    
    public List<Review> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        reviews.forEach(this::populateReview);
        return reviews;
    }
    
    public Map<String, Object> getAllReviewsWithStats() {
        List<Review> reviews = reviewRepository.findAll();
        reviews.forEach(this::populateReview);
        
        // Calculate stats
        int totalReviews = reviews.size();
        long visibleReviews = reviews.stream().filter(Review::getVisible).count();
        long hiddenReviews = totalReviews - visibleReviews;
        
        double averageRating = reviews.isEmpty() ? 0.0 : 
            reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        // Rating distribution
        Map<Integer, Long> distribution = new java.util.HashMap<>();
        for (int i = 1; i <= 5; i++) {
            final int rating = i;
            distribution.put(i, reviews.stream()
                .filter(r -> r.getRating() == rating)
                .count());
        }
        
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalReviews", totalReviews);
        stats.put("visibleReviews", visibleReviews);
        stats.put("hiddenReviews", hiddenReviews);
        stats.put("averageRating", String.format("%.1f", averageRating));
        stats.put("distribution", distribution);
        
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("reviews", reviews);
        result.put("stats", stats);
        
        return result;
    }
    
    public Review toggleReviewVisibility(String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setVisible(!review.getVisible());
        return reviewRepository.save(review);
    }
    
    public void deleteReview(String reviewId) {
        // Get review to update service rating after deletion
        Review review = reviewRepository.findById(reviewId).orElse(null);
        reviewRepository.deleteById(reviewId);
        
        // Update service rating after deletion
        if (review != null && review.getServiceId() != null) {
            updateServiceRating(review.getServiceId());
        }
    }
}
