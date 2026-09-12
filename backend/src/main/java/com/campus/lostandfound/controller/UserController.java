package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.ChangePasswordRequest;
import com.campus.lostandfound.dto.request.UpdateProfileRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.dto.response.UserResponse;
import com.campus.lostandfound.security.CurrentUser;
import com.campus.lostandfound.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(@CurrentUser UserDetails userDetails) {
        UserResponse response = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(@CurrentUser UserDetails userDetails, @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@CurrentUser UserDetails userDetails, @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<ApiResponse> uploadProfilePicture(@CurrentUser UserDetails userDetails, @RequestParam("file") MultipartFile file) {
        UserResponse response = userService.uploadProfilePicture(userDetails.getUsername(), file);
        return ResponseEntity.ok(ApiResponse.success("Profile picture uploaded successfully", response));
    }

    @DeleteMapping("/deactivate")
    public ResponseEntity<ApiResponse> deactivateAccount(@CurrentUser UserDetails userDetails) {
        userService.deactivateAccount(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Account deactivated successfully", null));
    }
}
