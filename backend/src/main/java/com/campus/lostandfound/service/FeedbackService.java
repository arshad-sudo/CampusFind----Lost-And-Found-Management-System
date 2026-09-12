package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.FeedbackRequest;
import com.campus.lostandfound.dto.response.FeedbackResponse;
import com.campus.lostandfound.dto.response.PagedResponse;

public interface FeedbackService {
    FeedbackResponse submitFeedback(String userEmail, FeedbackRequest request);
    PagedResponse<FeedbackResponse> getAllFeedback(int page, int size);
}
