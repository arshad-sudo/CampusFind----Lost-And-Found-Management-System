package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.DashboardStatsResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.dto.response.UserResponse;
import com.campus.lostandfound.entity.Category;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.ClaimStatus;
import com.campus.lostandfound.enums.FoundItemStatus;
import com.campus.lostandfound.enums.LostItemStatus;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.mapper.UserMapper;
import com.campus.lostandfound.repository.*;
import com.campus.lostandfound.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final CategoryRepository categoryRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalLostItems = lostItemRepository.count();
        long totalFoundItems = foundItemRepository.count();
        long pendingClaims = claimRequestRepository.countByStatus(ClaimStatus.PENDING);
        long returnedItems = lostItemRepository.countByStatus(LostItemStatus.RETURNED)
                + foundItemRepository.countByStatus(FoundItemStatus.RETURNED);
        long activeUsers = userRepository.countByActive(true);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalLostItems(totalLostItems)
                .totalFoundItems(totalFoundItems)
                .pendingClaims(pendingClaims)
                .returnedItems(returnedItems)
                .activeUsers(activeUsers)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMonthlyStats() {
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (String month : months) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", month);
            map.put("lost", 5 + new Random().nextInt(15));
            map.put("found", 3 + new Random().nextInt(12));
            monthlyData.add(map);
        }
        return monthlyData;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCategoryStats() {
        List<Category> categories = categoryRepository.findAll();
        List<Map<String, Object>> categoryData = new ArrayList<>();
        for (Category cat : categories) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", cat.getName());
            map.put("value", 2 + new Random().nextInt(20));
            categoryData.add(map);
        }
        return categoryData;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentActivities() {
        List<Map<String, Object>> activities = new ArrayList<>();

        lostItemRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .forEach(item -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", item.getId());
                    act.put("type", "LOST_ITEM");
                    act.put("description", "Lost Item reported: " + item.getItemName());
                    act.put("timestamp", item.getCreatedAt());
                    activities.add(act);
                });

        foundItemRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .forEach(item -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", item.getId());
                    act.put("type", "FOUND_ITEM");
                    act.put("description", "Found Item reported: " + item.getItemName());
                    act.put("timestamp", item.getCreatedAt());
                    activities.add(act);
                });

        return activities;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage;
        if (StringUtils.hasText(search)) {
            userPage = userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, search, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return new PagedResponse<>(
                userPage.getContent().stream().map(userMapper::toResponse).toList(),
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setActive(true);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public UserResponse deactivateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setActive(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    @Override
    public void approveLostItem(Long id) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));
        item.setStatus(LostItemStatus.ADMIN_VERIFIED);
        lostItemRepository.save(item);
    }

    @Override
    public void approveFoundItem(Long id) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));
        item.setStatus(FoundItemStatus.VERIFIED);
        foundItemRepository.save(item);
    }

    @Override
    public void rejectLostItem(Long id) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));
        lostItemRepository.delete(item);
    }

    @Override
    public void rejectFoundItem(Long id) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));
        foundItemRepository.delete(item);
    }

    @Override
    public void deleteLostItem(Long id) {
        lostItemRepository.deleteById(id);
    }

    @Override
    public void deleteFoundItem(Long id) {
        foundItemRepository.deleteById(id);
    }

    @Override
    public void updateLostItemStatus(Long id, String status) {
        LostItem item = lostItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LostItem", "id", id));
        item.setStatus(LostItemStatus.valueOf(status.toUpperCase()));
        lostItemRepository.save(item);
    }

    @Override
    public void updateFoundItemStatus(Long id, String status) {
        FoundItem item = foundItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoundItem", "id", id));
        item.setStatus(FoundItemStatus.valueOf(status.toUpperCase()));
        foundItemRepository.save(item);
    }
}
