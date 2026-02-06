package com.servesync.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class UploadService {
    
    @Autowired
    private Cloudinary cloudinary;
    
    public String uploadImage(MultipartFile file, String folder) {
        try {
            if (file == null || file.isEmpty()) {
                return null;
            }
        
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "auto"
                    ));
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }
    
    public void deleteImage(String imageUrl) {
        try {
            // Extract public ID from URL
            String publicId = extractPublicId(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }
    
    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("/")) {
            return null;
        }
        
        // Extract public ID from Cloudinary URL
        String[] parts = imageUrl.split("/");
        if (parts.length >= 2) {
            String lastPart = parts[parts.length - 1];
            String secondLastPart = parts[parts.length - 2];
            return secondLastPart + "/" + lastPart.split("\\.")[0];
        }
        
        return null;
    }
}
