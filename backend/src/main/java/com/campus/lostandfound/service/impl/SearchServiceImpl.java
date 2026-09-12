package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.FoundItemResponse;
import com.campus.lostandfound.dto.response.LostItemResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.enums.FoundItemStatus;
import com.campus.lostandfound.enums.LostItemStatus;
import com.campus.lostandfound.mapper.ItemMapper;
import com.campus.lostandfound.repository.FoundItemRepository;
import com.campus.lostandfound.repository.LostItemRepository;
import com.campus.lostandfound.repository.specification.FoundItemSpecification;
import com.campus.lostandfound.repository.specification.LostItemSpecification;
import com.campus.lostandfound.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchServiceImpl implements SearchService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ItemMapper itemMapper;

    @Override
    public PagedResponse<?> searchItems(
            String query,
            String category,
            String color,
            String brand,
            String dateFrom,
            String dateTo,
            String location,
            String status,
            String type,
            String sort,
            int page,
            int size
    ) {
        Sort sortOrder = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("oldest".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "createdAt");
        } else if ("az".equalsIgnoreCase(sort)) {
            sortOrder = Sort.by(Sort.Direction.ASC, "itemName");
        }

        Pageable pageable = PageRequest.of(page, size, sortOrder);

        LocalDate from = StringUtils.hasText(dateFrom) ? LocalDate.parse(dateFrom) : null;
        LocalDate to = StringUtils.hasText(dateTo) ? LocalDate.parse(dateTo) : null;

        if ("FOUND".equalsIgnoreCase(type)) {
            FoundItemStatus foundStatus = StringUtils.hasText(status) ? FoundItemStatus.valueOf(status.toUpperCase()) : null;
            Specification<FoundItem> spec = Specification.where(FoundItemSpecification.withQuery(query))
                    .and(FoundItemSpecification.withCategory(category))
                    .and(FoundItemSpecification.withLocation(location))
                    .and(FoundItemSpecification.withStatus(foundStatus))
                    .and(FoundItemSpecification.withDateRange(from, to));

            Page<FoundItem> foundPage = foundItemRepository.findAll(spec, pageable);
            return new PagedResponse<>(
                    foundPage.getContent().stream().map(itemMapper::toFoundItemResponse).toList(),
                    foundPage.getNumber(),
                    foundPage.getSize(),
                    foundPage.getTotalElements(),
                    foundPage.getTotalPages(),
                    foundPage.isLast()
            );
        } else {
            // Default to LOST
            LostItemStatus lostStatus = StringUtils.hasText(status) ? LostItemStatus.valueOf(status.toUpperCase()) : null;
            Specification<LostItem> spec = Specification.where(LostItemSpecification.withQuery(query))
                    .and(LostItemSpecification.withCategory(category))
                    .and(LostItemSpecification.withColor(color))
                    .and(LostItemSpecification.withBrand(brand))
                    .and(LostItemSpecification.withLocation(location))
                    .and(LostItemSpecification.withStatus(lostStatus))
                    .and(LostItemSpecification.withDateRange(from, to));

            Page<LostItem> lostPage = lostItemRepository.findAll(spec, pageable);
            return new PagedResponse<>(
                    lostPage.getContent().stream().map(itemMapper::toLostItemResponse).toList(),
                    lostPage.getNumber(),
                    lostPage.getSize(),
                    lostPage.getTotalElements(),
                    lostPage.getTotalPages(),
                    lostPage.isLast()
            );
        }
    }
}
