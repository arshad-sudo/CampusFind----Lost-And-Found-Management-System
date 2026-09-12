package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.response.CategoryResponse;
import com.campus.lostandfound.exception.ResourceNotFoundException;
import com.campus.lostandfound.mapper.ItemMapper;
import com.campus.lostandfound.repository.CategoryRepository;
import com.campus.lostandfound.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ItemMapper itemMapper;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(itemMapper::toCategoryResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(itemMapper::toCategoryResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }
}
