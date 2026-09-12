package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.ClaimRequestDto;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.dto.response.ClaimResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ApiResponse> submitClaim(
            Authentication authentication,
            @Valid @RequestPart("data") ClaimRequestDto request,
            @RequestPart(value = "proofImage", required = false) MultipartFile proofImage
    ) {
        ClaimResponse response = claimService.submitClaim(authentication.getName(), request, proofImage);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim submitted successfully", response));
    }

    @GetMapping("/my-claims")
    public ResponseEntity<ApiResponse> getMyClaims(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ClaimResponse> response = claimService.getMyClaims(authentication.getName(), page, size);
        return ResponseEntity.ok(ApiResponse.success("My claims retrieved successfully", response));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelClaim(
            Authentication authentication,
            @PathVariable Long id
    ) {
        claimService.cancelClaim(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Claim cancelled successfully", null));
    }
}
