package com.servesync.dto.provider;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderApplicationRequest {
    
    @NotBlank(message = "Business name is required")
    private String businessName;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience must be non-negative")
    private Integer experience;
    
    private List<String> certifications;
}
