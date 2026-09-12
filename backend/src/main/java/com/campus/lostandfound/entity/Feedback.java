package com.campus.lostandfound.entity;

import com.campus.lostandfound.enums.FeedbackType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private Integer rating;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FeedbackType type = FeedbackType.FEEDBACK;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
