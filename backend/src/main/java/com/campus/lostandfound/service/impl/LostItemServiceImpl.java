package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.request.LostItemRequest;
import com.campus.lostandfound.dto.response.LostItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.Category;
import com.campus.lostandfound.entity.ItemImage;
import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.LostItemStatus;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.exception.UnauthorizedException;
import com.campus.lostandfound.mapper.ItemMapper;
import com.campus.lostandfound.repository.CategoryRepository;
import com.campus.lostandfound.repository.ItemImageRepository;
import com.campus.lostandfound.repository.LostItemRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.LostItemService;
import com.campus.lostandfound.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LostItemServiceImpl implements LostItemService {

    private final LostItemRepository lostItemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ItemImageRepository itemImageRepository;
    private final ItemMapper itemMapper;
    private final FileStorageUtil fileStorageUtil;

    @Override
    public LostItemResponse createLostItem(String userEmail, LostItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        LostItem lostItem = LostItem.builder()
                .itemName(request.getItemName())
                .category(category)
                .description(request.getDescription())
                .brand(request.getBrand())
                .color(request.getColor())
                .locationLost(request.getLocationLost())
                .dateLost(request.getDateLost())
                .approximateTime(request.getApproximateTime())
                .rewardAmount(request.getRewardAmount())
                .additionalNotes(request.getAdditionalNotes())
                .status(LostItemStatus.LOST)
                .user(user)
                .build();

        LostItem saved = lostItemRepository.save(lostItem);
        return itemMapper.toLostItemResponse(saved);
    }

    @Override
    public LostItemResponse updateLostItem(String userEmail, Long id, LostItemRequest request) {
        LostItem lostItem = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));

        if (!lostItem.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to update this item");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            lostItem.setCategory(category);
        }

        lostItem.setItemName(request.getItemName());
        lostItem.setDescription(request.getDescription());
        lostItem.setBrand(request.getBrand());
        lostItem.setColor(request.getColor());
        lostItem.setLocationLost(request.getLocationLost());
        lostItem.setDateLost(request.getDateLost());
        lostItem.setApproximateTime(request.getApproximateTime());
        lostItem.setRewardAmount(request.getRewardAmount());
        lostItem.setAdditionalNotes(request.getAdditionalNotes());

        LostItem updated = lostItemRepository.save(lostItem);
        return itemMapper.toLostItemResponse(updated);
    }

    @Override
    public void deleteLostItem(String userEmail, Long id) {
        LostItem lostItem = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));

        if (!lostItem.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to delete this item");
        }

        if (lostItem.getImages() != null) {
            lostItem.getImages().forEach(img -> fileStorageUtil.deleteFile(img.getFilePath()));
        }
        lostItemRepository.delete(lostItem);
    }

    @Override
    @Transactional(readOnly = true)
    public LostItemResponse getLostItemById(Long id) {
        LostItem lostItem = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));
        return itemMapper.toLostItemResponse(lostItem);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<LostItemResponse> getMyLostItems(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size);
        Page<LostItem> itemsPage = lostItemRepository.findByUser(user, pageable);

        return new PagedResponse<>(
                itemsPage.getContent().stream().map(itemMapper::toLostItemResponse).toList(),
                itemsPage.getNumber(),
                itemsPage.getSize(),
                itemsPage.getTotalElements(),
                itemsPage.getTotalPages(),
                itemsPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<LostItemResponse> getAllLostItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LostItem> itemsPage = lostItemRepository.findAll(pageable);

        return new PagedResponse<>(
                itemsPage.getContent().stream().map(itemMapper::toLostItemResponse).toList(),
                itemsPage.getNumber(),
                itemsPage.getSize(),
                itemsPage.getTotalElements(),
                itemsPage.getTotalPages(),
                itemsPage.isLast()
        );
    }

    @Override
    public LostItemResponse uploadImages(String userEmail, Long id, List<MultipartFile> files) {
        LostItem lostItem = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));

        if (!lostItem.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to modify this item");
        }

        for (MultipartFile file : files) {
            String path = fileStorageUtil.storeFile(file, "lost-items");
            ItemImage img = ItemImage.builder()
                    .fileName(file.getOriginalFilename())
                    .filePath(path)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .lostItem(lostItem)
                    .build();
            itemImageRepository.save(img);
        }

        LostItem updated = lostItemRepository.findById(id).orElseThrow();
        return itemMapper.toLostItemResponse(updated);
    }
}
