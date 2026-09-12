package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendPasswordResetEmail(String to, String resetLink) {
        log.info("Sending password reset email to {}: Link = {}", to, resetLink);
    }

    @Override
    public void sendNotificationEmail(String to, String subject, String body) {
        log.info("Sending notification email to {}: Subject = {}, Body = {}", to, subject, body);
    }
}
