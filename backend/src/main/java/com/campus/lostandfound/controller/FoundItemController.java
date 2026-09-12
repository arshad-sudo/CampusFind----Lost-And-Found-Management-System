package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.FoundItemRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.dto.response.FoundItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.service.FoundItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/found-items")
@RequiredArgsConstructor
public class FoundItemController {

    private final FoundItemService foundItemService;

    @PostMapping
    public ResponseEntity<ApiResponse> createFoundItem(
            Authentication authentication,
            @Valid @RequestBody FoundItemRequest request
    ) {
        FoundItemResponse response = foundItemService.createFoundItem(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Found item reported successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateFoundItem(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody FoundItemRequest request
    ) {
        FoundItemResponse response = foundItemService.updateFoundItem(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Found item updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteFoundItem(
            Authentication authentication,
            @PathVariable Long id
    ) {
        foundItemService.deleteFoundItem(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Found item deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getFoundItem(@PathVariable Long id) {
        FoundItemResponse response = foundItemService.getFoundItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Found item retrieved successfully", response));
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse> getMyFoundItems(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<FoundItemResponse> response = foundItemService.getMyFoundItems(authentication.getName(), page, size);
        return ResponseEntity.ok(ApiResponse.success("My found items retrieved successfully", response));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse> uploadImages(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        FoundItemResponse response = foundItemService.uploadImages(authentication.getName(), id, files);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", response));
    }
}
