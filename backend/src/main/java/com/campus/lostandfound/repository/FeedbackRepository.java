package com.campus.lostandfound.repository;

import com.campus.lostandfound.entity.Feedback;
import com.campus.lostandfound.enums.FeedbackType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByType(FeedbackType type, Pageable pageable);
}
