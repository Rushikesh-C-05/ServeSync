package com.servesync.service;

import com.servesync.model.Category;
import com.servesync.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    public Category addCategory(String name) {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists");
        }
        
        Category category = new Category();
        category.setName(name);
        category.setCreatedAt(LocalDateTime.now());
        
        return categoryRepository.save(category);
    }
    
    public Category updateCategory(String oldName, String newName) {
        Category category = categoryRepository.findByName(oldName)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (!oldName.equals(newName) && categoryRepository.existsByName(newName)) {
            throw new RuntimeException("New category name already exists");
        }
        
        category.setName(newName);
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(String name) {
        if (!categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteByName(name);
    }
}
