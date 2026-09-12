package com.campus.lostandfound.dto.response;

import com.campus.lostandfound.enums.LostItemStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class LostItemResponse {
    private Long id;
    private String itemName;
    private CategoryResponse category;
    private String description;
    private String brand;
    private String color;
    private String locationLost;
    private LocalDate dateLost;
    private String approximateTime;
    private BigDecimal rewardAmount;
    private String additionalNotes;
    private LostItemStatus status;
    private UserResponse reportedBy;
    private List<ImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
