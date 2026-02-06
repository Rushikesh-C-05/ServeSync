package com.servesync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class ServeSyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServeSyncApplication.class, args);   
    }
}
