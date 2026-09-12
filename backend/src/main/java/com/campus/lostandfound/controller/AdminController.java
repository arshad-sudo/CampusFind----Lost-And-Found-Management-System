package com.campus.lostandfound.controller;

import com.campus.lostandfound.dto.response.*;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ClaimService claimService;
    private final ReportService reportService;
    private final FeedbackService feedbackService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        DashboardStatsResponse response = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", response));
    }

    @GetMapping("/dashboard/monthly-stats")
    public ResponseEntity<ApiResponse> getMonthlyStats() {
        List<Map<String, Object>> response = adminService.getMonthlyStats();
        return ResponseEntity.ok(ApiResponse.success("Monthly stats retrieved", response));
    }

    @GetMapping("/dashboard/category-stats")
    public ResponseEntity<ApiResponse> getCategoryStats() {
        List<Map<String, Object>> response = adminService.getCategoryStats();
        return ResponseEntity.ok(ApiResponse.success("Category stats retrieved", response));
    }

    @GetMapping("/dashboard/recent-activities")
    public ResponseEntity<ApiResponse> getRecentActivities() {
        List<Map<String, Object>> response = adminService.getRecentActivities();
        return ResponseEntity.ok(ApiResponse.success("Recent activities retrieved", response));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserResponse> response = adminService.getAllUsers(search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", response));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        UserResponse response = adminService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", response));
    }

    @PutMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        UserResponse response = adminService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated", response));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable Long id) {
        UserResponse response = adminService.deactivateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deactivated", response));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @PutMapping("/lost-items/{id}/approve")
    public ResponseEntity<ApiResponse> approveLostItem(@PathVariable Long id) {
        adminService.approveLostItem(id);
        return ResponseEntity.ok(ApiResponse.success("Lost item approved", null));
    }

    @PutMapping("/found-items/{id}/approve")
    public ResponseEntity<ApiResponse> approveFoundItem(@PathVariable Long id) {
        adminService.approveFoundItem(id);
        return ResponseEntity.ok(ApiResponse.success("Found item approved", null));
    }

    @PutMapping("/lost-items/{id}/reject")
    public ResponseEntity<ApiResponse> rejectLostItem(@PathVariable Long id) {
        adminService.rejectLostItem(id);
        return ResponseEntity.ok(ApiResponse.success("Lost item rejected", null));
    }

    @PutMapping("/found-items/{id}/reject")
    public ResponseEntity<ApiResponse> rejectFoundItem(@PathVariable Long id) {
        adminService.rejectFoundItem(id);
        return ResponseEntity.ok(ApiResponse.success("Found item rejected", null));
    }

    @DeleteMapping("/lost-items/{id}")
    public ResponseEntity<ApiResponse> deleteLostItem(@PathVariable Long id) {
        adminService.deleteLostItem(id);
        return ResponseEntity.ok(ApiResponse.success("Lost item deleted", null));
    }

    @DeleteMapping("/found-items/{id}")
    public ResponseEntity<ApiResponse> deleteFoundItem(@PathVariable Long id) {
        adminService.deleteFoundItem(id);
        return ResponseEntity.ok(ApiResponse.success("Found item deleted", null));
    }

    @PutMapping("/lost-items/{id}/status")
    public ResponseEntity<ApiResponse> updateLostItemStatus(@PathVariable Long id, @RequestParam String status) {
        adminService.updateLostItemStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Lost item status updated", null));
    }

    @PutMapping("/found-items/{id}/status")
    public ResponseEntity<ApiResponse> updateFoundItemStatus(@PathVariable Long id, @RequestParam String status) {
        adminService.updateFoundItemStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Found item status updated", null));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse> getAllClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ClaimResponse> response = claimService.getAllClaims(page, size);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved", response));
    }

    @PutMapping("/claims/{id}/approve")
    public ResponseEntity<ApiResponse> approveClaim(@PathVariable Long id) {
        ClaimResponse response = claimService.approveClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Claim approved", response));
    }

    @PutMapping("/claims/{id}/reject")
    public ResponseEntity<ApiResponse> rejectClaim(@PathVariable Long id, @RequestParam(required = false) String adminNotes) {
        ClaimResponse response = claimService.rejectClaim(id, adminNotes);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected", response));
    }

    @PutMapping("/claims/{id}/return")
    public ResponseEntity<ApiResponse> markClaimReturned(@PathVariable Long id) {
        ClaimResponse response = claimService.markReturned(id);
        return ResponseEntity.ok(ApiResponse.success("Claim marked as returned", response));
    }

    @GetMapping("/feedback")
    public ResponseEntity<ApiResponse> getAllFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<FeedbackResponse> response = feedbackService.getAllFeedback(page, size);
        return ResponseEntity.ok(ApiResponse.success("Feedback retrieved", response));
    }

    @GetMapping("/reports/generate")
    public ResponseEntity<byte[]> generateReport(
            Authentication authentication,
            @RequestParam ReportType type,
            @RequestParam ReportFormat format,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo
    ) {
        LocalDate from = dateFrom != null ? LocalDate.parse(dateFrom) : null;
        LocalDate to = dateTo != null ? LocalDate.parse(dateTo) : null;

        byte[] fileData = reportService.generateReport(authentication.getName(), type, format, from, to);

        String filename = "report_" + type.name().toLowerCase() + "." + format.name().toLowerCase();
        MediaType mediaType = format == ReportFormat.PDF ? MediaType.APPLICATION_PDF : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(fileData);
    }
}
