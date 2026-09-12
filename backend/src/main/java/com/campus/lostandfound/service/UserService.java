package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.ChangePasswordRequest;
import com.campus.lostandfound.dto.request.UpdateProfileRequest;
import com.campus.lostandfound.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserResponse getProfile(String email);
    UserResponse updateProfile(String email, UpdateProfileRequest request);
    void changePassword(String email, ChangePasswordRequest request);
    UserResponse uploadProfilePicture(String email, MultipartFile file);
    void deactivateAccount(String email);
}
