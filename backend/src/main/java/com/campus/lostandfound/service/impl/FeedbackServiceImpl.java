package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.dto.request.FeedbackRequest;
import com.campus.lostandfound.dto.response.FeedbackResponse;
import com.campus.lostandfound.dto.response.PagedResponse;
import com.campus.lostandfound.entity.Feedback;
import com.campus.lostandfound.entity.User;
import com.campus.lostandfound.enums.FeedbackType;
import com.campus.lostandfound.mapper.UserMapper;
import com.campus.lostandfound.repository.FeedbackRepository;
import com.campus.lostandfound.repository.UserRepository;
import com.campus.lostandfound.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public FeedbackResponse submitFeedback(String userEmail, FeedbackRequest request) {
        User user = null;
        if (StringUtils.hasText(userEmail)) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        Feedback feedback = Feedback.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .rating(request.getRating())
                .type(request.getType() != null ? request.getType() : FeedbackType.FEEDBACK)
                .user(user)
                .build();

        Feedback saved = feedbackRepository.save(feedback);

        return FeedbackResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .subject(saved.getSubject())
                .message(saved.getMessage())
                .rating(saved.getRating())
                .type(saved.getType())
                .user(saved.getUser() != null ? userMapper.toResponse(saved.getUser()) : null)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<FeedbackResponse> getAllFeedback(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Feedback> feedbackPage = feedbackRepository.findAll(pageable);

        return new PagedResponse<>(
                feedbackPage.getContent().stream().map(f -> FeedbackResponse.builder()
                        .id(f.getId())
                        .name(f.getName())
                        .email(f.getEmail())
                        .subject(f.getSubject())
                        .message(f.getMessage())
                        .rating(f.getRating())
                        .type(f.getType())
                        .user(f.getUser() != null ? userMapper.toResponse(f.getUser()) : null)
                        .createdAt(f.getCreatedAt())
                        .build()).toList(),
                feedbackPage.getNumber(),
                feedbackPage.getSize(),
                feedbackPage.getTotalElements(),
                feedbackPage.getTotalPages(),
                feedbackPage.isLast()
        );
    }
}
