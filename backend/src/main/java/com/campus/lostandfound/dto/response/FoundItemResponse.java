package com.campus.lostandfound.dto.response;

import com.campus.lostandfound.enums.FoundItemStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class FoundItemResponse {
    private Long id;
    private String itemName;
    private CategoryResponse category;
    private String description;
    private String foundLocation;
    private LocalDate dateFound;
    private String timeFound;
    private String currentStorageLocation;
    private FoundItemStatus status;
    private UserResponse reportedBy;
    private List<ImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
