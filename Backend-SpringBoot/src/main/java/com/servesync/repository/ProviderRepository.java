package com.servesync.repository;

import com.servesync.model.Provider;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends MongoRepository<Provider, String> {
    
    Optional<Provider> findByUserId(String userId);
    
    List<Provider> findByStatus(Provider.ProviderStatus status);
    
    List<Provider> findByCategory(String category);
    
    Boolean existsByUserId(String userId);
}
