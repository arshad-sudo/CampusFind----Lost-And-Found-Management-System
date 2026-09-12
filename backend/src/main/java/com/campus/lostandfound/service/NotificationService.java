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
