package com.servesync.controller;

import com.servesync.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("message", "ServeSync API is running");
        health.put("timestamp", LocalDateTime.now());
        health.put("status", "OK");
        
        return ResponseEntity.ok(ApiResponse.success("Health check successful", health));
    }
}
