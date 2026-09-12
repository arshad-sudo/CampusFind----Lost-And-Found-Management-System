package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.ImageResponse;

public interface ImageService {
    ImageResponse getImage(Long imageId);
    void deleteImage(String userEmail, Long imageId);
}
