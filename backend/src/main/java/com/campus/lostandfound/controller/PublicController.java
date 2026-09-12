package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.*;
import com.campus.lostandfound.service.CategoryService;
import com.campus.lostandfound.service.FoundItemService;
import com.campus.lostandfound.service.LostItemService;
import com.campus.lostandfound.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final LostItemService lostItemService;
    private final FoundItemService foundItemService;
    private final CategoryService categoryService;
    private final SearchService searchService;

    @GetMapping("/lost-items")
    public ResponseEntity<ApiResponse> getAllLostItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<LostItemResponse> response = lostItemService.getAllLostItems(page, size);
        return ResponseEntity.ok(ApiResponse.success("Lost items retrieved successfully", response));
    }

    @GetMapping("/found-items")
    public ResponseEntity<ApiResponse> getAllFoundItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<FoundItemResponse> response = foundItemService.getAllFoundItems(page, size);
        return ResponseEntity.ok(ApiResponse.success("Found items retrieved successfully", response));
    }

    @GetMapping("/lost-items/{id}")
    public ResponseEntity<ApiResponse> getLostItem(@PathVariable Long id) {
        LostItemResponse response = lostItemService.getLostItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Lost item retrieved successfully", response));
    }

    @GetMapping("/found-items/{id}")
    public ResponseEntity<ApiResponse> getFoundItem(@PathVariable Long id) {
        FoundItemResponse response = foundItemService.getFoundItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Found item retrieved successfully", response));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<?> response = searchService.searchItems(query, category, color, brand, dateFrom, dateTo, location, status, type, sort, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", response));
    }
}
