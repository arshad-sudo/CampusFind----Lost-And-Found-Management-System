package com.campus.lostandfound.repository;

import com.campus.lostandfound.entity.Notification;
import com.campus.lostandfound.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    long countByUserAndIsRead(User user, boolean isRead);
    List<Notification> findByUserAndIsRead(User user, boolean isRead);
}
