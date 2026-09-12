package com.campus.lostandfound.service;

import com.campus.lostandfound.dto.response.PagedResponse;

public interface SearchService {
    PagedResponse<?> searchItems(
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
    );
}
