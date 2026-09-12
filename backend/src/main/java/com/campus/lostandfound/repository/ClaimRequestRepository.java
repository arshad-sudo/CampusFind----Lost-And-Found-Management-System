package com.campus.lostandfound.repository;

import com.campus.lostandfound.entity.ClaimRequest;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {
    Page<ClaimRequest> findByUser(User user, Pageable pageable);
    Page<ClaimRequest> findByFoundItem(FoundItem foundItem, Pageable pageable);
    Page<ClaimRequest> findByStatus(ClaimStatus status, Pageable pageable);
    long countByStatus(ClaimStatus status);
    boolean existsByUserAndFoundItem(User user, FoundItem foundItem);
}
