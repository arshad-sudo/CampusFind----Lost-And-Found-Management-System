package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.ImageResponse;
import com.campus.lostandfound.entity.ItemImage;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.exception.UnauthorizedException;
import com.campus.lostandfound.mapper.ItemMapper;
import com.campus.lostandfound.repository.ItemImageRepository;
import com.campus.lostandfound.service.ImageService;
import com.campus.lostandfound.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageServiceImpl implements ImageService {

    private final ItemImageRepository itemImageRepository;
    private final FileStorageUtil fileStorageUtil;
    private final ItemMapper itemMapper;

    @Override
    @Transactional(readOnly = true)
    public ImageResponse getImage(Long imageId) {
        ItemImage image = itemImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ItemImage", "id", imageId));
        return itemMapper.toImageResponse(image);
    }

    @Override
    public void deleteImage(String userEmail, Long imageId) {
        ItemImage image = itemImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("ItemImage", "id", imageId));

        boolean isOwner = false;
        if (image.getLostItem() != null && image.getLostItem().getUser().getEmail().equals(userEmail)) {
            isOwner = true;
        } else if (image.getFoundItem() != null && image.getFoundItem().getUser().getEmail().equals(userEmail)) {
            isOwner = true;
        }

        if (!isOwner) {
            throw new UnauthorizedException("You are not authorized to delete this image");
        }

        fileStorageUtil.deleteFile(image.getFilePath());
        itemImageRepository.delete(image);
    }
}
