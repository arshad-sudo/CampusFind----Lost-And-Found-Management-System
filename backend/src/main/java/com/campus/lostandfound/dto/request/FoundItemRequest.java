package com.campus.lostandfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FoundItemRequest {
    @NotBlank(message = "Item name is required")
    private String itemName;
    
    private Long categoryId;
    private String description;
    private String foundLocation;
    private LocalDate dateFound;
    private String timeFound;
    private String currentStorageLocation;
}
