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

FILES["controller/LostItemController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.LostItemRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.LostItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
@RequiredArgsConstructor
public class LostItemController {

    private final LostItemService lostItemService;

    @PostMapping
    public ResponseEntity<ApiResponse> createLostItem(Authentication authentication, @RequestBody LostItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse(true, "Lost item created", lostItemService.createLostItem(authentication.getName(), request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateLostItem(Authentication authentication, @PathVariable Long id, @RequestBody LostItemRequest request) {
        return ResponseEntity.ok(
                new ApiResponse(true, "Lost item updated", lostItemService.updateLostItem(authentication.getName(), id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteLostItem(Authentication authentication, @PathVariable Long id) {
        lostItemService.deleteLostItem(authentication.getName(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Lost item deleted", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getLostItem(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", lostItemService.getLostItemById(id)));
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse> getMyLostItems(Authentication authentication,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", lostItemService.getMyLostItems(authentication.getName(), page, size)));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse> uploadImages(Authentication authentication, @PathVariable Long id, @RequestParam List<MultipartFile> files) {
        return ResponseEntity.ok(new ApiResponse(true, "Images uploaded", lostItemService.uploadImages(authentication.getName(), id, files)));
    }
}
"""

FILES["controller/FoundItemController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.FoundItemRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.FoundItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/found-items")
@RequiredArgsConstructor
public class FoundItemController {

    private final FoundItemService foundItemService;

    @PostMapping
    public ResponseEntity<ApiResponse> createFoundItem(Authentication authentication, @RequestBody FoundItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse(true, "Found item created", foundItemService.createFoundItem(authentication.getName(), request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateFoundItem(Authentication authentication, @PathVariable Long id, @RequestBody FoundItemRequest request) {
        return ResponseEntity.ok(
                new ApiResponse(true, "Found item updated", foundItemService.updateFoundItem(authentication.getName(), id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteFoundItem(Authentication authentication, @PathVariable Long id) {
        foundItemService.deleteFoundItem(authentication.getName(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Found item deleted", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getFoundItem(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", foundItemService.getFoundItemById(id)));
    }

    @GetMapping("/my-items")
    public ResponseEntity<ApiResponse> getMyFoundItems(Authentication authentication,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", foundItemService.getMyFoundItems(authentication.getName(), page, size)));
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse> uploadImages(Authentication authentication, @PathVariable Long id, @RequestParam List<MultipartFile> files) {
        return ResponseEntity.ok(new ApiResponse(true, "Images uploaded", foundItemService.uploadImages(authentication.getName(), id, files)));
    }
}
"""

FILES["controller/PublicController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.CategoryService;
import com.campus.lostandfound.service.FoundItemService;
import com.campus.lostandfound.service.LostItemService;
import com.campus.lostandfound.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final LostItemService lostItemService;
    private final FoundItemService foundItemService;
    private final CategoryService categoryService;
    private final SearchService searchService;

    @GetMapping("/lost-items")
    public ResponseEntity<ApiResponse> getAllLostItems(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", lostItemService.getAllLostItems(page, size)));
    }

    @GetMapping("/found-items")
    public ResponseEntity<ApiResponse> getAllFoundItems(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", foundItemService.getAllFoundItems(page, size)));
    }

    @GetMapping("/lost-items/{id}")
    public ResponseEntity<ApiResponse> getLostItemById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", lostItemService.getLostItemById(id)));
    }

    @GetMapping("/found-items/{id}")
    public ResponseEntity<ApiResponse> getFoundItemById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", foundItemService.getFoundItemById(id)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse> getAllCategories() {
        return ResponseEntity.ok(new ApiResponse(true, "Success", categoryService.getAllCategories()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchItems(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", searchService.searchItems(query, category, color, brand, dateFrom, dateTo, location, status, type, sort, page, size)));
    }
}
"""

FILES["controller/ClaimController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.ClaimRequestDto;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ApiResponse> submitClaim(Authentication authentication,
                                                   @RequestPart("request") ClaimRequestDto request,
                                                   @RequestPart(value = "proofImage", required = false) MultipartFile proofImage) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse(true, "Claim submitted", claimService.submitClaim(authentication.getName(), request, proofImage))
        );
    }

    @GetMapping("/my-claims")
    public ResponseEntity<ApiResponse> getMyClaims(Authentication authentication,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", claimService.getMyClaims(authentication.getName(), page, size)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelClaim(Authentication authentication, @PathVariable Long id) {
        claimService.cancelClaim(authentication.getName(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Claim canceled", null));
    }
}
"""

FILES["controller/NotificationController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse> getUserNotifications(Authentication authentication,
                                                            @RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", notificationService.getUserNotifications(authentication.getName(), page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse> getUnreadCount(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", notificationService.getUnreadCount(authentication.getName())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(Authentication authentication, @PathVariable Long id) {
        notificationService.markAsRead(authentication.getName(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read", null));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read", null));
    }
}
"""

FILES["controller/ImageController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getImage(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", imageService.getImage(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteImage(Authentication authentication, @PathVariable Long id) {
        imageService.deleteImage(authentication.getName(), id);
        return ResponseEntity.ok(new ApiResponse(true, "Image deleted", null));
    }
}
"""

FILES["controller/FeedbackController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.request.FeedbackRequest;
import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse> submitFeedback(Authentication authentication, @RequestBody FeedbackRequest request) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse(true, "Feedback submitted", feedbackService.submitFeedback(email, request))
        );
    }
}
"""

FILES["controller/AdminController.java"] = """
package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.ApiResponse;
import com.campus.lostandfound.enums.ReportFormat;
import com.campus.lostandfound.enums.ReportType;
import com.campus.lostandfound.service.AdminService;
import com.campus.lostandfound.service.ClaimService;
import com.campus.lostandfound.service.FeedbackService;
import com.campus.lostandfound.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ClaimService claimService;
    private final ReportService reportService;
    private final FeedbackService feedbackService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        return ResponseEntity.ok(new ApiResponse(true, "Success", adminService.getDashboardStats()));
    }

    @GetMapping("/dashboard/monthly-stats")
    public ResponseEntity<ApiResponse> getMonthlyStats() {
        return ResponseEntity.ok(new ApiResponse(true, "Success", adminService.getMonthlyStats()));
    }

    @GetMapping("/dashboard/category-stats")
    public ResponseEntity<ApiResponse> getCategoryStats() {
        return ResponseEntity.ok(new ApiResponse(true, "Success", adminService.getCategoryStats()));
    }

    @GetMapping("/dashboard/recent-activities")
    public ResponseEntity<ApiResponse> getRecentActivities() {
        return ResponseEntity.ok(new ApiResponse(true, "Success", adminService.getRecentActivities()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers(@RequestParam(required = false) String search,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", adminService.getAllUsers(search, page, size)));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", adminService.getUserById(id)));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "User activated", adminService.activateUser(id)));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "User deactivated", adminService.deactivateUser(id)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse(true, "User deleted", null));
    }

    @PutMapping("/lost-items/{id}/approve")
    public ResponseEntity<ApiResponse> approveLostItem(@PathVariable Long id) {
        adminService.approveLostItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Lost item approved", null));
    }

    @PutMapping("/found-items/{id}/approve")
    public ResponseEntity<ApiResponse> approveFoundItem(@PathVariable Long id) {
        adminService.approveFoundItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Found item approved", null));
    }

    @PutMapping("/lost-items/{id}/reject")
    public ResponseEntity<ApiResponse> rejectLostItem(@PathVariable Long id) {
        adminService.rejectLostItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Lost item rejected", null));
    }

    @PutMapping("/found-items/{id}/reject")
    public ResponseEntity<ApiResponse> rejectFoundItem(@PathVariable Long id) {
        adminService.rejectFoundItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Found item rejected", null));
    }

    @DeleteMapping("/lost-items/{id}")
    public ResponseEntity<ApiResponse> deleteLostItem(@PathVariable Long id) {
        adminService.deleteLostItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Lost item deleted", null));
    }

    @DeleteMapping("/found-items/{id}")
    public ResponseEntity<ApiResponse> deleteFoundItem(@PathVariable Long id) {
        adminService.deleteFoundItem(id);
        return ResponseEntity.ok(new ApiResponse(true, "Found item deleted", null));
    }

    @PutMapping("/lost-items/{id}/status")
    public ResponseEntity<ApiResponse> updateLostItemStatus(@PathVariable Long id, @RequestParam String status) {
        adminService.updateLostItemStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Lost item status updated", null));
    }

    @PutMapping("/found-items/{id}/status")
    public ResponseEntity<ApiResponse> updateFoundItemStatus(@PathVariable Long id, @RequestParam String status) {
        adminService.updateFoundItemStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Found item status updated", null));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse> getAllClaims(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", claimService.getAllClaims(page, size)));
    }

    @PutMapping("/claims/{id}/approve")
    public ResponseEntity<ApiResponse> approveClaim(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Claim approved", claimService.approveClaim(id)));
    }

    @PutMapping("/claims/{id}/reject")
    public ResponseEntity<ApiResponse> rejectClaim(@PathVariable Long id, @RequestParam String adminNotes) {
        return ResponseEntity.ok(new ApiResponse(true, "Claim rejected", claimService.rejectClaim(id, adminNotes)));
    }

    @PutMapping("/claims/{id}/return")
    public ResponseEntity<ApiResponse> markReturned(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(true, "Claim returned", claimService.markReturned(id)));
    }

    @GetMapping("/reports/generate")
    public ResponseEntity<byte[]> generateReport(Authentication authentication,
                                                 @RequestParam ReportType type,
                                                 @RequestParam ReportFormat format,
                                                 @RequestParam(required = false) String dateFrom,
                                                 @RequestParam(required = false) String dateTo) {
        LocalDate from = dateFrom != null ? LocalDate.parse(dateFrom) : null;
        LocalDate to = dateTo != null ? LocalDate.parse(dateTo) : null;
        byte[] report = reportService.generateReport(authentication.getName(), type, format, from, to);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report." + format.name().toLowerCase())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(report);
    }

    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse> getAllFeedback(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(new ApiResponse(true, "Success", feedbackService.getAllFeedback(page, size)));
    }
}
"""

for path, content in FILES.items():
    write_file(path, content)
