package org.wldu.webservices.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.enities.Category;
import org.wldu.webservices.services.contracts.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ✅ Create category
    @PostMapping("/create-categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> create(@Valid @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    // ✅ Get all categories
    @GetMapping("/list-categories")
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
}
