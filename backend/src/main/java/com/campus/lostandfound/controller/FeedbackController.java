package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.FeedbackRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.dto.response.FeedbackResponse;
import com.campus.lostandfound.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse> submitFeedback(
            Authentication authentication,
            @Valid @RequestBody FeedbackRequest request
    ) {
        String email = authentication != null ? authentication.getName() : null;
        FeedbackResponse response = feedbackService.submitFeedback(email, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback submitted successfully", response));
    }
}
