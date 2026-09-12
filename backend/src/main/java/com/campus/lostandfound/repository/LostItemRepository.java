package com.campus.lostandfound.repository;

import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.LostItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long>, JpaSpecificationExecutor<LostItem> {
    Page<LostItem> findByUser(User user, Pageable pageable);
    Page<LostItem> findByStatus(LostItemStatus status, Pageable pageable);
    long countByStatus(LostItemStatus status);
    List<LostItem> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT l.category.name, COUNT(l) FROM LostItem l GROUP BY l.category.name")
    List<Object[]> countByCategory();
}
