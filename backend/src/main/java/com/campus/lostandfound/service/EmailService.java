package com.campus.lostandfound.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String resetLink);
    void sendNotificationEmail(String to, String subject, String body);
}
