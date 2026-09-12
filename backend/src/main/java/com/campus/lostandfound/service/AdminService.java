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
