package com.servesync.service;

import com.servesync.model.Service;
import com.servesync.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }
    
    public Service getServiceById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }
    
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }
    
    public List<Service> getServicesByProvider(String providerId) {
        return serviceRepository.findByProviderId(providerId);
    }
    
    public List<Service> getServicesByCategory(String category) {
        return serviceRepository.findByCategory(category);
    }
    
    public List<Service> getAvailableServices() {
        return serviceRepository.findByIsAvailable(true);
    }
    
    public Service updateService(String id, Service updateData) {
        Service service = getServiceById(id);
        
        if (updateData.getName() != null) {
            service.setName(updateData.getName());
        }
        if (updateData.getDescription() != null) {
            service.setDescription(updateData.getDescription());
        }
        if (updateData.getCategory() != null) {
            service.setCategory(updateData.getCategory());
        }
        if (updateData.getPrice() != null) {
            service.setPrice(updateData.getPrice());
        }
        if (updateData.getDuration() != null) {
            service.setDuration(updateData.getDuration());
        }
        if (updateData.getLocation() != null) {
            service.setLocation(updateData.getLocation());
        }
        if (updateData.getImage() != null) {
            service.setImage(updateData.getImage());
        }
        if (updateData.getIsAvailable() != null) {
            service.setIsAvailable(updateData.getIsAvailable());
        }
        
        return serviceRepository.save(service);
    }
    
    public void deleteService(String id) {
        Service service = getServiceById(id);
        serviceRepository.delete(service);
    }
    
    public Service toggleAvailability(String id) {
        Service service = getServiceById(id);
        service.setIsAvailable(!service.getIsAvailable());
        return serviceRepository.save(service);
    }
    
    public List<Service> searchServices(String keyword, String category, Double minPrice, Double maxPrice) {
        List<Service> services = getAvailableServices();
        
        if (keyword != null && !keyword.isEmpty()) {
            String lowerKeyword = keyword.toLowerCase();
            services = services.stream()
                    .filter(s -> s.getName().toLowerCase().contains(lowerKeyword) ||
                               s.getDescription().toLowerCase().contains(lowerKeyword))
                    .toList();
        }
        
        if (category != null && !category.isEmpty()) {
            services = services.stream()
                    .filter(s -> s.getCategory().equalsIgnoreCase(category))
                    .toList();
        }
        
        if (minPrice != null) {
            services = services.stream()
                    .filter(s -> s.getPrice() >= minPrice)
                    .toList();
        }
        
        if (maxPrice != null) {
            services = services.stream()
                    .filter(s -> s.getPrice() <= maxPrice)
                    .toList();
        }
        
        return services;
    }
}
