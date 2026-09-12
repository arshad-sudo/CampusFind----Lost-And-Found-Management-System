package com.campus.lostandfound.dto.response;

import com.campus.lostandfound.enums.ClaimStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClaimResponse {
    private Long id;
    private String reason;
    private String proofOfOwnership;
    private String proofImagePath;
    private String additionalDescription;
    private ClaimStatus status;
    private String adminNotes;
    private UserResponse claimant;
    private FoundItemResponse foundItem;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
