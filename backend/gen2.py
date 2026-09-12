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

FILES["repository/specification/LostItemSpecification.java"] = """
package com.campus.lostandfound.repository.specification;

import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.enums.LostItemStatus;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.JoinType;

import java.time.LocalDate;

public class LostItemSpecification {

    public static Specification<LostItem> withItemName(String query) {
        return (root, criteriaQuery, criteriaBuilder) ->
                query == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("itemName")), "%" + query.toLowerCase() + "%");
    }

    public static Specification<LostItem> withCategory(String category) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (category == null) return null;
            root.fetch("category", JoinType.LEFT);
            return criteriaBuilder.equal(root.get("category").get("name"), category);
        };
    }

    public static Specification<LostItem> withColor(String color) {
        return (root, criteriaQuery, criteriaBuilder) ->
                color == null ? null : criteriaBuilder.equal(criteriaBuilder.lower(root.get("primaryColor")), color.toLowerCase());
    }

    public static Specification<LostItem> withBrand(String brand) {
        return (root, criteriaQuery, criteriaBuilder) ->
                brand == null ? null : criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<LostItem> withDateRange(LocalDate dateFrom, LocalDate dateTo) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (dateFrom != null && dateTo != null) {
                return criteriaBuilder.between(root.get("lostDate"), dateFrom, dateTo);
            } else if (dateFrom != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("lostDate"), dateFrom);
            } else if (dateTo != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("lostDate"), dateTo);
            }
            return null;
        };
    }

    public static Specification<LostItem> withLocation(String location) {
        return (root, criteriaQuery, criteriaBuilder) ->
                location == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("lostLocation")), "%" + location.toLowerCase() + "%");
    }

    public static Specification<LostItem> withStatus(LostItemStatus status) {
        return (root, criteriaQuery, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }
}
"""

FILES["repository/specification/FoundItemSpecification.java"] = """
package com.campus.lostandfound.repository.specification;

import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.enums.FoundItemStatus;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.JoinType;

import java.time.LocalDate;

public class FoundItemSpecification {

    public static Specification<FoundItem> withItemName(String query) {
        return (root, criteriaQuery, criteriaBuilder) ->
                query == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("itemName")), "%" + query.toLowerCase() + "%");
    }

    public static Specification<FoundItem> withCategory(String category) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (category == null) return null;
            root.fetch("category", JoinType.LEFT);
            return criteriaBuilder.equal(root.get("category").get("name"), category);
        };
    }

    public static Specification<FoundItem> withColor(String color) {
        return (root, criteriaQuery, criteriaBuilder) ->
                color == null ? null : criteriaBuilder.equal(criteriaBuilder.lower(root.get("primaryColor")), color.toLowerCase());
    }

    public static Specification<FoundItem> withBrand(String brand) {
        return (root, criteriaQuery, criteriaBuilder) ->
                brand == null ? null : criteriaBuilder.equal(criteriaBuilder.lower(root.get("brand")), brand.toLowerCase());
    }

    public static Specification<FoundItem> withDateRange(LocalDate dateFrom, LocalDate dateTo) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (dateFrom != null && dateTo != null) {
                return criteriaBuilder.between(root.get("foundDate"), dateFrom, dateTo);
            } else if (dateFrom != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("foundDate"), dateFrom);
            } else if (dateTo != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("foundDate"), dateTo);
            }
            return null;
        };
    }

    public static Specification<FoundItem> withLocation(String location) {
        return (root, criteriaQuery, criteriaBuilder) ->
                location == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("foundLocation")), "%" + location.toLowerCase() + "%");
    }

    public static Specification<FoundItem> withStatus(FoundItemStatus status) {
        return (root, criteriaQuery, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }
}
"""


FILES["service/SearchService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.PagedResponse;

public interface SearchService {
    PagedResponse<Object> searchItems(String query, String category, String color, String brand, String dateFrom, String dateTo, String location, String status, String type, String sort, int page, int size);
}
"""

FILES["service/impl/SearchServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.enums.FoundItemStatus;
import com.campus.lostandfound.enums.LostItemStatus;
import com.campus.lostandfound.mapper.ItemMapper;
import com.campus.lostandfound.repository.FoundItemRepository;
import com.campus.lostandfound.repository.LostItemRepository;
import com.campus.lostandfound.repository.specification.FoundItemSpecification;
import com.campus.lostandfound.repository.specification.LostItemSpecification;
import com.campus.lostandfound.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ItemMapper itemMapper;

    @Override
    public PagedResponse<Object> searchItems(String query, String category, String color, String brand, String dateFromStr, String dateToStr, String location, String status, String type, String sort, int page, int size) {
        LocalDate dateFrom = dateFromStr != null && !dateFromStr.isEmpty() ? LocalDate.parse(dateFromStr) : null;
        LocalDate dateTo = dateToStr != null && !dateToStr.isEmpty() ? LocalDate.parse(dateToStr) : null;

        Sort.Direction direction = Sort.Direction.DESC;
        String sortBy = "createdAt";
        if ("oldest".equalsIgnoreCase(sort)) {
            direction = Sort.Direction.ASC;
        } else if ("az".equalsIgnoreCase(sort)) {
            sortBy = "itemName";
            direction = Sort.Direction.ASC;
        }
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortBy));

        List<Object> allItems = new ArrayList<>();
        long totalElements = 0;
        int totalPages = 0;

        if ("LOST".equalsIgnoreCase(type) || type == null) {
            Specification<LostItem> spec = Specification.where(LostItemSpecification.withItemName(query))
                    .and(LostItemSpecification.withCategory(category))
                    .and(LostItemSpecification.withColor(color))
                    .and(LostItemSpecification.withBrand(brand))
                    .and(LostItemSpecification.withDateRange(dateFrom, dateTo))
                    .and(LostItemSpecification.withLocation(location))
                    .and(LostItemSpecification.withStatus(status != null ? LostItemStatus.valueOf(status) : null));
            Page<LostItem> lostPage = lostItemRepository.findAll(spec, pageRequest);
            allItems.addAll(lostPage.getContent().stream().map(itemMapper::toLostItemResponse).collect(Collectors.toList()));
            totalElements += lostPage.getTotalElements();
            totalPages = Math.max(totalPages, lostPage.getTotalPages());
        }

        if ("FOUND".equalsIgnoreCase(type) || type == null) {
            Specification<FoundItem> spec = Specification.where(FoundItemSpecification.withItemName(query))
                    .and(FoundItemSpecification.withCategory(category))
                    .and(FoundItemSpecification.withColor(color))
                    .and(FoundItemSpecification.withBrand(brand))
                    .and(FoundItemSpecification.withDateRange(dateFrom, dateTo))
                    .and(FoundItemSpecification.withLocation(location))
                    .and(FoundItemSpecification.withStatus(status != null ? FoundItemStatus.valueOf(status) : null));
            Page<FoundItem> foundPage = foundItemRepository.findAll(spec, pageRequest);
            allItems.addAll(foundPage.getContent().stream().map(itemMapper::toFoundItemResponse).collect(Collectors.toList()));
            totalElements += foundPage.getTotalElements();
            totalPages = Math.max(totalPages, foundPage.getTotalPages());
        }

        // Extremely simple pagination for mixed results (for production this should be properly interleaved)
        int fromIndex = Math.min(page * size, allItems.size());
        int toIndex = Math.min(fromIndex + size, allItems.size());
        List<Object> pagedList = allItems.subList(fromIndex, toIndex);

        return new PagedResponse<>(pagedList, page, size, totalElements, totalPages, page >= totalPages - 1);
    }
}
"""

FILES["service/AdminService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.DashboardStatsResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.dto.response.UserResponse;

import java.util.List;
import java.util.Map;

public interface AdminService {
    DashboardStatsResponse getDashboardStats();
    List<Map<String, Object>> getMonthlyStats();
    List<Map<String, Object>> getCategoryStats();
    List<Map<String, Object>> getRecentActivities();
    PagedResponse<UserResponse> getAllUsers(String search, int page, int size);
    UserResponse getUserById(Long id);
    UserResponse activateUser(Long id);
    UserResponse deactivateUser(Long id);
    void deleteUser(Long id);
    void approveLostItem(Long id);
    void approveFoundItem(Long id);
    void rejectLostItem(Long id);
    void rejectFoundItem(Long id);
    void deleteLostItem(Long id);
    void deleteFoundItem(Long id);
    void updateLostItemStatus(Long id, String status);
    void updateFoundItemStatus(Long id, String status);
}
"""

FILES["service/impl/AdminServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.DashboardStatsResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.dto.response.UserResponse;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.FoundItemStatus;
import com.campus.lostandfound.enums.LostItemStatus;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.mapper.UserMapper;
import com.campus.lostandfound.repository.ClaimRequestRepository;
import com.campus.lostandfound.repository.FoundItemRepository;
import com.campus.lostandfound.repository.LostItemRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRequestRepository claimRequestRepository;
    private final UserMapper userMapper;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalLostItems(lostItemRepository.count())
                .totalFoundItems(foundItemRepository.count())
                .totalClaims(claimRequestRepository.count())
                .build();
    }

    @Override
    public List<Map<String, Object>> getMonthlyStats() {
        return new ArrayList<>(); // Stub for brevity
    }

    @Override
    public List<Map<String, Object>> getCategoryStats() {
        return new ArrayList<>(); // Stub
    }

    @Override
    public List<Map<String, Object>> getRecentActivities() {
        return new ArrayList<>(); // Stub
    }

    @Override
    public PagedResponse<UserResponse> getAllUsers(String search, int page, int size) {
        Page<User> users = userRepository.findAll(PageRequest.of(page, size));
        return new PagedResponse<>(users.map(userMapper::toUserResponse).getContent(), users.getNumber(), users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
    }

    @Override
    public UserResponse getUserById(Long id) {
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Override
    public UserResponse activateUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(true);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse deactivateUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public void approveLostItem(Long id) {
        updateLostItemStatus(id, LostItemStatus.OPEN.name());
    }

    @Override
    public void approveFoundItem(Long id) {
        updateFoundItemStatus(id, FoundItemStatus.UNCLAIMED.name());
    }

    @Override
    public void rejectLostItem(Long id) {
        updateLostItemStatus(id, LostItemStatus.CLOSED.name());
    }

    @Override
    public void rejectFoundItem(Long id) {
        updateFoundItemStatus(id, FoundItemStatus.UNCLAIMED.name());
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
        LostItem item = lostItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        item.setStatus(LostItemStatus.valueOf(status));
        lostItemRepository.save(item);
    }

    @Override
    public void updateFoundItemStatus(Long id, String status) {
        FoundItem item = foundItemRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        item.setStatus(FoundItemStatus.valueOf(status));
        foundItemRepository.save(item);
    }
}
"""

FILES["service/ReportService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.enums.ReportFormat;
import com.campus.lostandfound.enums.ReportType;

import java.time.LocalDate;

public interface ReportService {
    byte[] generateReport(String userEmail, ReportType type, ReportFormat format, LocalDate dateFrom, LocalDate dateTo);
}
"""

FILES["service/impl/ReportServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.enums.ReportFormat;
import com.campus.lostandfound.enums.ReportType;
import com.campus.lostandfound.service.ReportService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ReportServiceImpl implements ReportService {
    @Override
    public byte[] generateReport(String userEmail, ReportType type, ReportFormat format, LocalDate dateFrom, LocalDate dateTo) {
        // Dummy implementation for brevity
        return "Report content".getBytes();
    }
}
"""

FILES["service/FeedbackService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.request.FeedbackRequest;
import com.campus.lostandfound.dto.response.FeedbackResponse;
import com.campus.lostandfound.dto.response.PagedResponse;

public interface FeedbackService {
    FeedbackResponse submitFeedback(String userEmail, FeedbackRequest request);
    PagedResponse<FeedbackResponse> getAllFeedback(int page, int size);
}
"""

FILES["service/impl/FeedbackServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.request.FeedbackRequest;
import com.campus.lostandfound.dto.response.FeedbackResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.Feedback;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.repository.FeedbackRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @Override
    public FeedbackResponse submitFeedback(String userEmail, FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setSubject(request.getSubject());
        feedback.setMessage(request.getMessage());
        feedback.setRating(request.getRating());
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            feedback.setUser(user);
        }
        feedback = feedbackRepository.save(feedback);
        return new FeedbackResponse(feedback.getId(), feedback.getSubject(), feedback.getMessage(), feedback.getRating(), feedback.getCreatedAt());
    }

    @Override
    public PagedResponse<FeedbackResponse> getAllFeedback(int page, int size) {
        Page<Feedback> pageRes = feedbackRepository.findAll(PageRequest.of(page, size));
        return new PagedResponse<>(
                pageRes.map(f -> new FeedbackResponse(f.getId(), f.getSubject(), f.getMessage(), f.getRating(), f.getCreatedAt())).getContent(),
                pageRes.getNumber(), pageRes.getSize(), pageRes.getTotalElements(), pageRes.getTotalPages(), pageRes.isLast()
        );
    }
}
"""

FILES["service/EmailService.java"] = """
package com.campus.lostandfound.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String resetLink);
    void sendNotificationEmail(String to, String subject, String body);
}
"""

FILES["service/impl/EmailServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.service.EmailService;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        // Implementation stub
        System.out.println("Sending reset email to " + to + ": " + resetLink);
    }

    @Override
    public void sendNotificationEmail(String to, String subject, String body) {
        // Implementation stub
        System.out.println("Sending notification to " + to + " - " + subject);
    }
}
"""

FILES["service/CategoryService.java"] = """
package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
}
"""

FILES["service/impl/CategoryServiceImpl.java"] = """
package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.CategoryResponse;
import com.campus.lostandfound.entity.Category;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.repository.CategoryRepository;
import com.campus.lostandfound.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getDescription(), c.getIconUrl()))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category c = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription(), c.getIconUrl());
    }
}
"""


for path, content in FILES.items():
    write_file(path, content)
