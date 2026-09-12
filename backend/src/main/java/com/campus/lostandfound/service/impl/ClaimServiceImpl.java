package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.request.ClaimRequestDto;
import com.campus.lostandfound.dto.response.ClaimResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.ClaimRequest;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.ClaimStatus;
import com.campus.lostandfound.enums.FoundItemStatus;
import com.campus.lostandfound.enums.NotificationType;
import com.campus.lostandfound.exception.BadRequestException;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.exception.UnauthorizedException;
import com.campus.lostandfound.mapper.ClaimMapper;
import com.campus.lostandfound.repository.ClaimRequestRepository;
import com.campus.lostandfound.repository.FoundItemRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.ClaimService;
import com.campus.lostandfound.service.NotificationService;
import com.campus.lostandfound.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRequestRepository claimRepository;
    private final FoundItemRepository foundItemRepository;
    private final UserRepository userRepository;
    private final ClaimMapper claimMapper;
    private final FileStorageUtil fileStorageUtil;
    private final NotificationService notificationService;

    @Override
    public ClaimResponse submitClaim(String userEmail, ClaimRequestDto request, MultipartFile proofImage) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        FoundItem foundItem = foundItemRepository.findById(request.getFoundItemId())
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", request.getFoundItemId()));

        String proofPath = null;
        if (proofImage != null && !proofImage.isEmpty()) {
            proofPath = fileStorageUtil.storeFile(proofImage, "claims");
        }

        ClaimRequest claim = ClaimRequest.builder()
                .reason(request.getReason())
                .proofOfOwnership(request.getProofOfOwnership())
                .proofImagePath(proofPath)
                .additionalDescription(request.getAdditionalDescription())
                .status(ClaimStatus.PENDING)
                .user(user)
                .foundItem(foundItem)
                .build();

        ClaimRequest saved = claimRepository.save(claim);

        notificationService.createNotification(
                foundItem.getUser().getId(),
                "New Claim Submitted",
                "A user has submitted a claim for your reported found item: " + foundItem.getItemName(),
                NotificationType.NEW_MATCH_FOUND,
                saved.getId(),
                "CLAIM"
        );

        return claimMapper.toClaimResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ClaimResponse> getMyClaims(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size);
        Page<ClaimRequest> claimsPage = claimRepository.findByUser(user, pageable);

        return new PagedResponse<>(
                claimsPage.getContent().stream().map(claimMapper::toClaimResponse).toList(),
                claimsPage.getNumber(),
                claimsPage.getSize(),
                claimsPage.getTotalElements(),
                claimsPage.getTotalPages(),
                claimsPage.isLast()
        );
    }

    @Override
    public void cancelClaim(String userEmail, Long claimId) {
        ClaimRequest claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("ClaimRequest", "id", claimId));

        if (!claim.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to cancel this claim");
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new BadRequestException("Only pending claims can be cancelled");
        }
        claimRepository.delete(claim);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ClaimResponse> getAllClaims(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClaimRequest> claimsPage = claimRepository.findAll(pageable);

        return new PagedResponse<>(
                claimsPage.getContent().stream().map(claimMapper::toClaimResponse).toList(),
                claimsPage.getNumber(),
                claimsPage.getSize(),
                claimsPage.getTotalElements(),
                claimsPage.getTotalPages(),
                claimsPage.isLast()
        );
    }

    @Override
    public ClaimResponse approveClaim(Long claimId) {
        ClaimRequest claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("ClaimRequest", "id", claimId));

        claim.setStatus(ClaimStatus.APPROVED);

        FoundItem foundItem = claim.getFoundItem();
        foundItem.setStatus(FoundItemStatus.CLAIMED);
        foundItemRepository.save(foundItem);

        ClaimRequest updated = claimRepository.save(claim);

        notificationService.createNotification(
                claim.getUser().getId(),
                "Claim Approved",
                "Your claim for '" + foundItem.getItemName() + "' has been approved!",
                NotificationType.CLAIM_APPROVED,
                updated.getId(),
                "CLAIM"
        );

        return claimMapper.toClaimResponse(updated);
    }

    @Override
    public ClaimResponse rejectClaim(Long claimId, String adminNotes) {
        ClaimRequest claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("ClaimRequest", "id", claimId));

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setAdminNotes(adminNotes);
        ClaimRequest updated = claimRepository.save(claim);

        notificationService.createNotification(
                claim.getUser().getId(),
                "Claim Rejected",
                "Your claim for '" + claim.getFoundItem().getItemName() + "' was rejected. Reason: " + adminNotes,
                NotificationType.CLAIM_REJECTED,
                updated.getId(),
                "CLAIM"
        );

        return claimMapper.toClaimResponse(updated);
    }

    @Override
    public ClaimResponse markReturned(Long claimId) {
        ClaimRequest claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("ClaimRequest", "id", claimId));

        claim.setStatus(ClaimStatus.RETURNED);

        FoundItem foundItem = claim.getFoundItem();
        foundItem.setStatus(FoundItemStatus.RETURNED);
        foundItemRepository.save(foundItem);

        ClaimRequest updated = claimRepository.save(claim);

        notificationService.createNotification(
                claim.getUser().getId(),
                "Item Marked Returned",
                "Your claimed item '" + foundItem.getItemName() + "' has been marked as returned.",
                NotificationType.ITEM_VERIFIED,
                updated.getId(),
                "CLAIM"
        );

        return claimMapper.toClaimResponse(updated);
    }
}
