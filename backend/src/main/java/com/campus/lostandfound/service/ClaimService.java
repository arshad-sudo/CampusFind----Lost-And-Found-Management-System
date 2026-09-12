package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.ClaimRequestDto;
import com.campus.lostandfound.dto.response.ClaimResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ClaimService {
    ClaimResponse submitClaim(String userEmail, ClaimRequestDto request, MultipartFile proofImage);
    PagedResponse<ClaimResponse> getMyClaims(String userEmail, int page, int size);
    void cancelClaim(String userEmail, Long claimId);
    PagedResponse<ClaimResponse> getAllClaims(int page, int size);
    ClaimResponse approveClaim(Long claimId);
    ClaimResponse rejectClaim(Long claimId, String adminNotes);
    ClaimResponse markReturned(Long claimId);
}
