package com.campus.lostandfound.dto.response;

import com.campus.lostandfound.enums.FeedbackType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private Integer rating;
    private FeedbackType type;
    private UserResponse user;
    private LocalDateTime createdAt;
}
