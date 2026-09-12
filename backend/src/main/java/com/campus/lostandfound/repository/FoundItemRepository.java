package com.campus.lostandfound.repository;

import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.FoundItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FoundItemRepository extends JpaRepository<FoundItem, Long>, JpaSpecificationExecutor<FoundItem> {
    Page<FoundItem> findByUser(User user, Pageable pageable);
    Page<FoundItem> findByStatus(FoundItemStatus status, Pageable pageable);
    long countByStatus(FoundItemStatus status);
    List<FoundItem> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT f.category.name, COUNT(f) FROM FoundItem f GROUP BY f.category.name")
    List<Object[]> countByCategory();
}
