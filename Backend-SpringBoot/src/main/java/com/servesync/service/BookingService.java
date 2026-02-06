package com.servesync.service;

import com.servesync.model.*;
import com.servesync.repository.BookingRepository;
import com.servesync.repository.PaymentRepository;
import com.servesync.repository.ProviderRepository;
import com.servesync.repository.ServiceRepository;
import com.servesync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private ProviderRepository providerRepository;
    
    public Booking createBooking(String userId, Booking booking) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate service exists
        com.servesync.model.Service service = serviceRepository.findById(booking.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));
        
        if (!service.getIsAvailable()) {
            throw new RuntimeException("Service is not available");
        }
        
        booking.setUserId(userId);
        booking.setProviderId(service.getProviderId());
        booking.setServiceAmount(service.getPrice());
        
        // Calculate platform fee (10%)
        double platformFee = service.getPrice() * 0.10;
        booking.setPlatformFee(platformFee);
        booking.setTotalAmount(service.getPrice() + platformFee);
        
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getUserBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        // Manually populate @DBRef fields
        bookings.forEach(booking -> {
            if (booking.getUserId() != null) {
                userRepository.findById(booking.getUserId()).ifPresent(booking::setUser);
            }
            if (booking.getServiceId() != null) {
                serviceRepository.findById(booking.getServiceId()).ifPresent(booking::setService);
            }
            if (booking.getProviderId() != null) {
                providerRepository.findById(booking.getProviderId()).ifPresent(booking::setProvider);
            }
        });
        return bookings;
    }
    
    public List<Booking> getProviderBookings(String providerId) {
        List<Booking> bookings = bookingRepository.findByProviderId(providerId);
        // Manually populate @DBRef fields
        bookings.forEach(booking -> {
            if (booking.getUserId() != null) {
                userRepository.findById(booking.getUserId()).ifPresent(booking::setUser);
            }
            if (booking.getServiceId() != null) {
                serviceRepository.findById(booking.getServiceId()).ifPresent(booking::setService);
            }
            if (booking.getProviderId() != null) {
                providerRepository.findById(booking.getProviderId()).ifPresent(booking::setProvider);
            }
        });
        return bookings;
    }
    
    public Booking getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        // Manually populate @DBRef fields
        if (booking.getUserId() != null) {
            userRepository.findById(booking.getUserId()).ifPresent(booking::setUser);
        }
        if (booking.getServiceId() != null) {
            serviceRepository.findById(booking.getServiceId()).ifPresent(booking::setService);
        }
        if (booking.getProviderId() != null) {
            providerRepository.findById(booking.getProviderId()).ifPresent(booking::setProvider);
        }
        return booking;
    }
    
    public Booking acceptBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Can only accept pending bookings");
        }
        
        booking.setStatus(Booking.BookingStatus.ACCEPTED);
        booking.setUpdatedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    public Booking rejectBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Can only reject pending bookings");
        }
        
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setUpdatedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    public Booking completeBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if (booking.getStatus() != Booking.BookingStatus.ACCEPTED) {
            throw new RuntimeException("Can only complete accepted bookings");
        }
        
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        booking.setUpdatedAt(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    public Booking cancelBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel completed bookings");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        
        // Initiate refund if payment was made
        paymentRepository.findByBookingId(bookingId).ifPresent(payment -> {
            if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                payment.setStatus(Payment.PaymentStatus.REFUNDED);
                paymentRepository.save(payment);
            }
        });
        
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        // Manually populate @DBRef fields
        bookings.forEach(booking -> {
            if (booking.getUserId() != null) {
                userRepository.findById(booking.getUserId()).ifPresent(booking::setUser);
            }
            if (booking.getServiceId() != null) {
                serviceRepository.findById(booking.getServiceId()).ifPresent(booking::setService);
            }
            if (booking.getProviderId() != null) {
                providerRepository.findById(booking.getProviderId()).ifPresent(booking::setProvider);
            }
        });
        return bookings;
    }
    
    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }
    
    public void deleteBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }
}
