package com.campus.lostandfound.mapper;

import com.campus.lostandfound.dto.response.CategoryResponse;
import com.campus.lostandfound.dto.response.FoundItemResponse;
import com.campus.lostandfound.dto.response.ImageResponse;
import com.campus.lostandfound.dto.response.LostItemResponse;
import com.campus.lostandfound.entity.Category;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.ItemImage;
import com.campus.lostandfound.entity.LostItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ItemMapper {

    @Autowired
    private UserMapper userMapper;

    public LostItemResponse toLostItemResponse(LostItem item) {
        if (item == null) return null;
        LostItemResponse response = new LostItemResponse();
        response.setId(item.getId());
        response.setItemName(item.getItemName());
        response.setCategory(toCategoryResponse(item.getCategory()));
        response.setDescription(item.getDescription());
        response.setBrand(item.getBrand());
        response.setColor(item.getColor());
        response.setLocationLost(item.getLocationLost());
        response.setDateLost(item.getDateLost());
        response.setApproximateTime(item.getApproximateTime());
        response.setRewardAmount(item.getRewardAmount());
        response.setAdditionalNotes(item.getAdditionalNotes());
        response.setStatus(item.getStatus());
        response.setReportedBy(userMapper.toResponse(item.getUser()));
        if (item.getImages() != null) {
            response.setImages(item.getImages().stream().map(this::toImageResponse).collect(Collectors.toList()));
        }
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        return response;
    }

    public FoundItemResponse toFoundItemResponse(FoundItem item) {
        if (item == null) return null;
        FoundItemResponse response = new FoundItemResponse();
        response.setId(item.getId());
        response.setItemName(item.getItemName());
        response.setCategory(toCategoryResponse(item.getCategory()));
        response.setDescription(item.getDescription());
        response.setFoundLocation(item.getFoundLocation());
        response.setDateFound(item.getDateFound());
        response.setTimeFound(item.getTimeFound());
        response.setCurrentStorageLocation(item.getCurrentStorageLocation());
        response.setStatus(item.getStatus());
        response.setReportedBy(userMapper.toResponse(item.getUser()));
        if (item.getImages() != null) {
            response.setImages(item.getImages().stream().map(this::toImageResponse).collect(Collectors.toList()));
        }
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        return response;
    }

    public ImageResponse toImageResponse(ItemImage image) {
        if (image == null) return null;
        ImageResponse response = new ImageResponse();
        response.setId(image.getId());
        response.setFileName(image.getFileName());
        response.setFilePath(image.getFilePath());
        response.setFileType(image.getFileType());
        response.setFileSize(image.getFileSize());
        response.setCreatedAt(image.getCreatedAt());
        return response;
    }

    public CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setIcon(category.getIcon());
        return response;
    }
}
