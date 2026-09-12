package com.campus.lostandfound.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ImageResponse {
    private Long id;
    private String fileName;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private LocalDateTime createdAt;
}
