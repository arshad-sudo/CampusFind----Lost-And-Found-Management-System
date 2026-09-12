package com.campus.lostandfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class LostItemRequest {
    @NotBlank(message = "Item name is required")
    private String itemName;
    
    private Long categoryId;
    private String description;
    private String brand;
    private String color;
    private String locationLost;
    private LocalDate dateLost;
    private String approximateTime;
    private BigDecimal rewardAmount;
    private String additionalNotes;
}
