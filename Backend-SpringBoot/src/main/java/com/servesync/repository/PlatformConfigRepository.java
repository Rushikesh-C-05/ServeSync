package com.servesync.repository;

import com.servesync.model.PlatformConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformConfigRepository extends MongoRepository<PlatformConfig, String> {
}
