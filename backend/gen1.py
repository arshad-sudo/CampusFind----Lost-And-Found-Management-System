import os
import pathlib

base_dir = r"C:\Users\aarsh\.gemini\antigravity\scratch\campus-lost-and-found\backend\src\main\java\com\campus\lostandfound"

def write_file(path, content):
    full_path = os.path.join(base_dir, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip())
        f.write("\n")

FILES = {}

FILES["service/LostItemService.java"] = """
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
"""

FILES["service/impl/LostItemServiceImpl.java"] = """
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
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        LostItem lostItem = itemMapper.toLostItemEntity(request);
        lostItem.setUser(user);
        lostItem.setCategory(category);
        lostItem.setStatus(LostItemStatus.OPEN);
        lostItem = lostItemRepository.save(lostItem);
        return itemMapper.toLostItemResponse(lostItem);
    }

    @Override
    public LostItemResponse updateLostItem(String userEmail, Long id, LostItemRequest request) {
        LostItem lostItem = lostItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!lostItem.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        itemMapper.updateLostItemFromRequest(request, lostItem);
        lostItem.setCategory(category);
        return itemMapper.toLostItemResponse(lostItemRepository.save(lostItem));
    }

    @Override
    public void deleteLostItem(String userEmail, Long id) {
        LostItem lostItem = lostItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!lostItem.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        lostItem.getImages().forEach(img -> fileStorageUtil.deleteFile(img.getImageUrl()));
        lostItemRepository.delete(lostItem);
    }

    @Override
    public LostItemResponse getLostItemById(Long id) {
        return itemMapper.toLostItemResponse(lostItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found")));
    }

    @Override
    public PagedResponse<LostItemResponse> getMyLostItems(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<LostItem> items = lostItemRepository.findByUserId(user.getId(), PageRequest.of(page, size));
        return new PagedResponse<>(items.map(itemMapper::toLostItemResponse).getContent(), items.getNumber(), items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
    }

    @Override
    public PagedResponse<LostItemResponse> getAllLostItems(int page, int size) {
        Page<LostItem> items = lostItemRepository.findAll(PageRequest.of(page, size));
        return new PagedResponse<>(items.map(itemMapper::toLostItemResponse).getContent(), items.getNumber(), items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
    }

    @Override
    public LostItemResponse uploadImages(String userEmail, Long id, List<MultipartFile> files) {
        LostItem lostItem = lostItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!lostItem.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        for (MultipartFile file : files) {
            String path = fileStorageUtil.storeFile(file, "lost-items");
            ItemImage img = new ItemImage();
            img.setImageUrl(path);
            img.setLostItem(lostItem);
            itemImageRepository.save(img);
        }
        return itemMapper.toLostItemResponse(lostItemRepository.findById(id).get());
    }
}
"""

FILES["service/FoundItemService.java"] = """
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
"""

FILES["service/impl/FoundItemServiceImpl.java"] = """
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
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        FoundItem foundItem = itemMapper.toFoundItemEntity(request);
        foundItem.setUser(user);
        foundItem.setCategory(category);
        foundItem.setStatus(FoundItemStatus.UNCLAIMED);
        foundItem = foundItemRepository.save(foundItem);
        return itemMapper.toFoundItemResponse(foundItem);
    }

    @Override
    public FoundItemResponse updateFoundItem(String userEmail, Long id, FoundItemRequest request) {
        FoundItem foundItem = foundItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!foundItem.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        itemMapper.updateFoundItemFromRequest(request, foundItem);
        foundItem.setCategory(category);
        return itemMapper.toFoundItemResponse(foundItemRepository.save(foundItem));
    }

    @Override
    public void deleteFoundItem(String userEmail, Long id) {
        FoundItem foundItem = foundItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!foundItem.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        foundItem.getImages().forEach(img -> fileStorageUtil.deleteFile(img.getImageUrl()));
        foundItemRepository.delete(foundItem);
    }

    @Override
    public FoundItemResponse getFoundItemById(Long id) {
        return itemMapper.toFoundItemResponse(foundItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found")));
    }

    @Override
    public PagedResponse<FoundItemResponse> getMyFoundItems(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<FoundItem> items = foundItemRepository.findByUserId(user.getId(), PageRequest.of(page, size));
        return new PagedResponse<>(items.map(itemMapper::toFoundItemResponse).getContent(), items.getNumber(), items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
    }

    @Override
    public PagedResponse<FoundItemResponse> getAllFoundItems(int page, int size) {
        Page<FoundItem> items = foundItemRepository.findAll(PageRequest.of(page, size));
        return new PagedResponse<>(items.map(itemMapper::toFoundItemResponse).getContent(), items.getNumber(), items.getSize(), items.getTotalElements(), items.getTotalPages(), items.isLast());
    }

    @Override
    public FoundItemResponse uploadImages(String userEmail, Long id, List<MultipartFile> files) {
        FoundItem foundItem = foundItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        if (!foundItem.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        for (MultipartFile file : files) {
            String path = fileStorageUtil.storeFile(file, "found-items");
            ItemImage img = new ItemImage();
            img.setImageUrl(path);
            img.setFoundItem(foundItem);
            itemImageRepository.save(img);
        }
        return itemMapper.toFoundItemResponse(foundItemRepository.findById(id).get());
    }
}
"""

FILES["service/ClaimService.java"] = """
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
"""

FILES["service/impl/ClaimServiceImpl.java"] = """
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
import com.campus.lostandfound.exception.ResourceNotFoundException;
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
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        FoundItem foundItem = foundItemRepository.findById(request.getFoundItemId()).orElseThrow(() -> new ResourceNotFoundException("FoundItem not found"));
        
        ClaimRequest claim = claimMapper.toClaimRequestEntity(request);
        claim.setUser(user);
        claim.setFoundItem(foundItem);
        claim.setStatus(ClaimStatus.PENDING);
        
        if (proofImage != null && !proofImage.isEmpty()) {
            claim.setProofImageUrl(fileStorageUtil.storeFile(proofImage, "claims"));
        }
        
        claim = claimRepository.save(claim);
        
        notificationService.createNotification(foundItem.getUser().getId(), "New Claim", "A user has claimed your found item.", NotificationType.CLAIM_UPDATE, claim.getId(), "CLAIM");
        
        return claimMapper.toClaimResponse(claim);
    }

    @Override
    public PagedResponse<ClaimResponse> getMyClaims(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<ClaimRequest> claims = claimRepository.findByUserId(user.getId(), PageRequest.of(page, size));
        return new PagedResponse<>(claims.map(claimMapper::toClaimResponse).getContent(), claims.getNumber(), claims.getSize(), claims.getTotalElements(), claims.getTotalPages(), claims.isLast());
    }

    @Override
    public void cancelClaim(String userEmail, Long claimId) {
        ClaimRequest claim = claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        if (!claim.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new RuntimeException("Only pending claims can be canceled");
        }
        claimRepository.delete(claim);
    }

    @Override
    public PagedResponse<ClaimResponse> getAllClaims(int page, int size) {
        Page<ClaimRequest> claims = claimRepository.findAll(PageRequest.of(page, size));
        return new PagedResponse<>(claims.map(claimMapper::toClaimResponse).getContent(), claims.getNumber(), claims.getSize(), claims.getTotalElements(), claims.getTotalPages(), claims.isLast());
    }

    @Override
    public ClaimResponse approveClaim(Long claimId) {
        ClaimRequest claim = claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        claim.setStatus(ClaimStatus.APPROVED);
        
        FoundItem foundItem = claim.getFoundItem();
        foundItem.setStatus(FoundItemStatus.CLAIMED);
        foundItemRepository.save(foundItem);
        
        claim = claimRepository.save(claim);
        notificationService.createNotification(claim.getUser().getId(), "Claim Approved", "Your claim has been approved.", NotificationType.CLAIM_UPDATE, claim.getId(), "CLAIM");
        
        return claimMapper.toClaimResponse(claim);
    }

    @Override
    public ClaimResponse rejectClaim(Long claimId, String adminNotes) {
        ClaimRequest claim = claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        claim.setStatus(ClaimStatus.REJECTED);
        claim.setAdminNotes(adminNotes);
        claim = claimRepository.save(claim);
        notificationService.createNotification(claim.getUser().getId(), "Claim Rejected", "Your claim has been rejected.", NotificationType.CLAIM_UPDATE, claim.getId(), "CLAIM");
        return claimMapper.toClaimResponse(claim);
    }

    @Override
    public ClaimResponse markReturned(Long claimId) {
        ClaimRequest claim = claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        claim.setStatus(ClaimStatus.RETURNED);
        
        FoundItem foundItem = claim.getFoundItem();
        foundItem.setStatus(FoundItemStatus.RETURNED);
        foundItemRepository.save(foundItem);
        
        claim = claimRepository.save(claim);
        notificationService.createNotification(claim.getUser().getId(), "Item Returned", "Your item has been marked as returned.", NotificationType.ITEM_MATCH, claim.getId(), "CLAIM");
        
        return claimMapper.toClaimResponse(claim);
    }
}
"""

FILES["service/NotificationService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.NotificationResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.enums.NotificationType;

public interface NotificationService {
    void createNotification(Long userId, String title, String message, NotificationType type, Long referenceId, String referenceType);
    PagedResponse<NotificationResponse> getUserNotifications(String userEmail, int page, int size);
    long getUnreadCount(String userEmail);
    void markAsRead(String userEmail, Long notificationId);
    void markAllAsRead(String userEmail);
}
"""

FILES["service/impl/NotificationServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.NotificationResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.Notification;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.NotificationType;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.repository.NotificationRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(Long userId, String title, String message, NotificationType type, Long referenceId, String referenceType) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setReferenceType(referenceType);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    @Override
    public PagedResponse<NotificationResponse> getUserNotifications(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<Notification> notifications = notificationRepository.findByUserId(user.getId(), PageRequest.of(page, size));
        return new PagedResponse<>(
            notifications.map(n -> new NotificationResponse(n.getId(), n.getTitle(), n.getMessage(), n.getType().name(), n.getReferenceId(), n.getReferenceType(), n.isRead(), n.getCreatedAt())).getContent(),
            notifications.getNumber(), notifications.getSize(), notifications.getTotalElements(), notifications.getTotalPages(), notifications.isLast()
        );
    }

    @Override
    public long getUnreadCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Override
    public void markAsRead(String userEmail, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsReadByUserId(user.getId());
    }
}
"""

FILES["service/ImageService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.ImageResponse;

public interface ImageService {
    ImageResponse getImage(Long imageId);
    void deleteImage(String userEmail, Long imageId);
}
"""

FILES["service/impl/ImageServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.ImageResponse;
import com.campus.lostandfound.entity.ItemImage;
import com.campus.lostandfound.exception.ResourceNotFoundException;
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

    @Override
    public ImageResponse getImage(Long imageId) {
        ItemImage image = itemImageRepository.findById(imageId).orElseThrow(() -> new ResourceNotFoundException("Image not found"));
        return new ImageResponse(image.getId(), image.getImageUrl(), image.getCreatedAt());
    }

    @Override
    public void deleteImage(String userEmail, Long imageId) {
        ItemImage image = itemImageRepository.findById(imageId).orElseThrow(() -> new ResourceNotFoundException("Image not found"));
        
        boolean isOwner = false;
        if (image.getLostItem() != null && image.getLostItem().getUser().getEmail().equals(userEmail)) {
            isOwner = true;
        } else if (image.getFoundItem() != null && image.getFoundItem().getUser().getEmail().equals(userEmail)) {
            isOwner = true;
        }
        
        if (!isOwner) {
            throw new RuntimeException("Unauthorized");
        }
        
        fileStorageUtil.deleteFile(image.getImageUrl());
        itemImageRepository.delete(image);
    }
}
"""

for path, content in FILES.items():
    write_file(path, content)
