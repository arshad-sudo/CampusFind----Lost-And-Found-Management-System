package com.campus.lostandfound.repository;

import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.ItemImage;
import com.campus.lostandfound.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {
    List<ItemImage> findByLostItem(LostItem lostItem);
    List<ItemImage> findByFoundItem(FoundItem foundItem);
}
