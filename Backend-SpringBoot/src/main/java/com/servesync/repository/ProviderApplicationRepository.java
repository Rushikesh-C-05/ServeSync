package com.servesync.repository;

import com.servesync.model.ProviderApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderApplicationRepository extends MongoRepository<ProviderApplication, String> {
    
    Optional<ProviderApplication> findByUserId(String userId);
    
    List<ProviderApplication> findByStatus(ProviderApplication.ApplicationStatus status);
    
    Boolean existsByUserId(String userId);
}
