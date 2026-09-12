package com.campus.lostandfound.dto.request;

import com.campus.lostandfound.enums.FeedbackType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FeedbackRequest {
    private String name;
    private String email;
    private String subject;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @Min(1)
    @Max(5)
    private Integer rating;
    
    private FeedbackType type;
}
