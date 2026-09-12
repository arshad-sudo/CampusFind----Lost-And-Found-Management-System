package com.campus.lostandfound.dto.response;

import com.campus.lostandfound.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String profilePicture;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
}
