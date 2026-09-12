package com.campus.lostandfound.mapper;

import com.campus.lostandfound.dto.response.ClaimResponse;
import com.campus.lostandfound.entity.ClaimRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClaimMapper {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ItemMapper itemMapper;

    public ClaimResponse toClaimResponse(ClaimRequest request) {
        if (request == null) return null;
        ClaimResponse response = new ClaimResponse();
        response.setId(request.getId());
        response.setReason(request.getReason());
        response.setProofOfOwnership(request.getProofOfOwnership());
        response.setProofImagePath(request.getProofImagePath());
        response.setAdditionalDescription(request.getAdditionalDescription());
        response.setStatus(request.getStatus());
        response.setAdminNotes(request.getAdminNotes());
        response.setClaimant(userMapper.toResponse(request.getUser()));
        response.setFoundItem(itemMapper.toFoundItemResponse(request.getFoundItem()));
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());
        return response;
    }
}
