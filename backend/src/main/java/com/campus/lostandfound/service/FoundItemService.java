package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.FoundItemRequest;
import com.campus.lostandfound.dto.response.FoundItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface FoundItemService {
    FoundItemResponse createFoundItem(String userEmail, FoundItemRequest request);
    FoundItemResponse updateFoundItem(String userEmail, Long id, FoundItemRequest request);
    void deleteFoundItem(String userEmail, Long id);
    FoundItemResponse getFoundItemById(Long id);
    PagedResponse<FoundItemResponse> getMyFoundItems(String userEmail, int page, int size);
    PagedResponse<FoundItemResponse> getAllFoundItems(int page, int size);
    FoundItemResponse uploadImages(String userEmail, Long id, List<MultipartFile> files);
}
