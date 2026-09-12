package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.request.FoundItemRequest;
import com.campus.lostandfound.dto.response.FoundItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.Category;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.ItemImage;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.FoundItemStatus;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.exception.UnauthorizedException;
import com.campus.lostandfound.mapper.ItemMapper;
import com.campus.lostandfound.repository.CategoryRepository;
import com.campus.lostandfound.repository.FoundItemRepository;
import com.campus.lostandfound.repository.ItemImageRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.FoundItemService;
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
public class FoundItemServiceImpl implements FoundItemService {

    private final FoundItemRepository foundItemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ItemImageRepository itemImageRepository;
    private final ItemMapper itemMapper;
    private final FileStorageUtil fileStorageUtil;

    @Override
    public FoundItemResponse createFoundItem(String userEmail, FoundItemRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        }

        FoundItem foundItem = FoundItem.builder()
                .itemName(request.getItemName())
                .category(category)
                .description(request.getDescription())
                .foundLocation(request.getFoundLocation())
                .dateFound(request.getDateFound())
                .timeFound(request.getTimeFound())
                .currentStorageLocation(request.getCurrentStorageLocation())
                .status(FoundItemStatus.PENDING_VERIFICATION)
                .user(user)
                .build();

        FoundItem saved = foundItemRepository.save(foundItem);
        return itemMapper.toFoundItemResponse(saved);
    }

    @Override
    public FoundItemResponse updateFoundItem(String userEmail, Long id, FoundItemRequest request) {
        FoundItem foundItem = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));

        if (!foundItem.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to update this item");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            foundItem.setCategory(category);
        }

        foundItem.setItemName(request.getItemName());
        foundItem.setDescription(request.getDescription());
        foundItem.setFoundLocation(request.getFoundLocation());
        foundItem.setDateFound(request.getDateFound());
        foundItem.setTimeFound(request.getTimeFound());
        foundItem.setCurrentStorageLocation(request.getCurrentStorageLocation());

        FoundItem updated = foundItemRepository.save(foundItem);
        return itemMapper.toFoundItemResponse(updated);
    }

    @Override
    public void deleteFoundItem(String userEmail, Long id) {
        FoundItem foundItem = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));

        if (!foundItem.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to delete this item");
        }

        if (foundItem.getImages() != null) {
            foundItem.getImages().forEach(img -> fileStorageUtil.deleteFile(img.getFilePath()));
        }
        foundItemRepository.delete(foundItem);
    }

    @Override
    @Transactional(readOnly = true)
    public FoundItemResponse getFoundItemById(Long id) {
        FoundItem foundItem = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));
        return itemMapper.toFoundItemResponse(foundItem);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<FoundItemResponse> getMyFoundItems(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Pageable pageable = PageRequest.of(page, size);
        Page<FoundItem> itemsPage = foundItemRepository.findByUser(user, pageable);

        return new PagedResponse<>(
                itemsPage.getContent().stream().map(itemMapper::toFoundItemResponse).toList(),
                itemsPage.getNumber(),
                itemsPage.getSize(),
                itemsPage.getTotalElements(),
                itemsPage.getTotalPages(),
                itemsPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<FoundItemResponse> getAllFoundItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FoundItem> itemsPage = foundItemRepository.findAll(pageable);

        return new PagedResponse<>(
                itemsPage.getContent().stream().map(itemMapper::toFoundItemResponse).toList(),
                itemsPage.getNumber(),
                itemsPage.getSize(),
                itemsPage.getTotalElements(),
                itemsPage.getTotalPages(),
                itemsPage.isLast()
        );
    }

    @Override
    public FoundItemResponse uploadImages(String userEmail, Long id, List<MultipartFile> files) {
        FoundItem foundItem = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));

        if (!foundItem.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to modify this item");
        }

        for (MultipartFile file : files) {
            String path = fileStorageUtil.storeFile(file, "found-items");
            ItemImage img = ItemImage.builder()
                    .fileName(file.getOriginalFilename())
                    .filePath(path)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .foundItem(foundItem)
                    .build();
            itemImageRepository.save(img);
        }

        FoundItem updated = foundItemRepository.findById(id).orElseThrow();
        return itemMapper.toFoundItemResponse(updated);
    }
}
