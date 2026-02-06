package com.servesync.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    
    @NotBlank(message = "Service ID is required")
    private String serviceId;
    
    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;
    
    @NotBlank(message = "Booking time is required")
    private String bookingTime;
    
    @NotBlank(message = "User address is required")
    private String userAddress;
    
    private String notes;
}
