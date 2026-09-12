package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.LostItemRequest;
import com.campus.lostandfound.dto.response.LostItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface LostItemService {
    LostItemResponse createLostItem(String userEmail, LostItemRequest request);
    LostItemResponse updateLostItem(String userEmail, Long id, LostItemRequest request);
    void deleteLostItem(String userEmail, Long id);
    LostItemResponse getLostItemById(Long id);
    PagedResponse<LostItemResponse> getMyLostItems(String userEmail, int page, int size);
    PagedResponse<LostItemResponse> getAllLostItems(int page, int size);
    LostItemResponse uploadImages(String userEmail, Long id, List<MultipartFile> files);
}
