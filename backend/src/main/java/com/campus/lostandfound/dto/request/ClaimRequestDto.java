package com.campus.lostandfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClaimRequestDto {
    @NotBlank(message = "Reason is required")
    private String reason;
    
    private String proofOfOwnership;
    private String additionalDescription;
    
    @NotNull(message = "Found item ID is required")
    private Long foundItemId;
}
