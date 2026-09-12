package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.LostItemRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.dto.response.LostItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.service.LostItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
@RequiredArgsConstructor
public class LostItemController {

    private final LostItemService lostItemService;

    @PostMapping
    public ResponseEntity<ApiResponse> createLostItem(
            Authentication authentication,
            @Valid @RequestBody LostItemRequest request
    ) {
        LostItemResponse response = lostItemService.createLostItem(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lost item reported successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateLostItem(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody LostItemRequest request
    ) {
        LostItemResponse response = lostItemService.updateLostItem(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Lost item updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteLostItem(
            Authentication authentication,
            @PathVariable Long id
    ) {
        lostItemService.deleteLostItem(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Lost item deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getLostItem(@PathVariable Long id) {
        LostItemResponse response = lostItemService.getLostItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Lost item retrieved successfully", response));
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse> getMyLostItems(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<LostItemResponse> response = lostItemService.getMyLostItems(authentication.getName(), page, size);
        return ResponseEntity.ok(ApiResponse.success("My lost items retrieved successfully", response));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse> uploadImages(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files
    ) {
        LostItemResponse response = lostItemService.uploadImages(authentication.getName(), id, files);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", response));
    }
}
