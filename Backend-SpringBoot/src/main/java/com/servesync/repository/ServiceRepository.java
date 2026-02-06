package com.servesync.repository;

import com.servesync.model.Service;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends MongoRepository<Service, String> {
    
    List<Service> findByProviderId(String providerId);
    
    List<Service> findByCategory(String category);
    
    List<Service> findByIsAvailable(Boolean isAvailable);
    
    List<Service> findByProviderIdAndIsAvailable(String providerId, Boolean isAvailable);
}
