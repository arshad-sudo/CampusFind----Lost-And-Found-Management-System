package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.dto.response.ImageResponse;
import com.campus.lostandfound.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getImage(@PathVariable Long id) {
        ImageResponse response = imageService.getImage(id);
        return ResponseEntity.ok(ApiResponse.success("Image retrieved successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteImage(
            Authentication authentication,
            @PathVariable Long id
    ) {
        imageService.deleteImage(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Image deleted successfully", null));
    }
}
