package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.ForgotPasswordRequest;
import com.campus.lostandfound.dto.request.LoginRequest;
import com.campus.lostandfound.dto.request.RegisterRequest;
import com.campus.lostandfound.dto.request.ResetPasswordRequest;
import com.campus.lostandfound.dto.response.AuthResponse;
import com.campus.lostandfound.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
