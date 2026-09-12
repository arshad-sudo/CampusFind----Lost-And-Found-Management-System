package com.campus.lostandfound.util;

import com.campus.lostandfound.exception.FileStorageException;
import jakarta.annotation.PostConstruct;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException ex) {
            throw new FileStorageException("Could not create upload directory", ex);
        }
    }

    public String storeFile(MultipartFile file, String subDir) {
        validateImageFile(file);
        String fileName = UUID.randomUUID() + "." + FilenameUtils.getExtension(file.getOriginalFilename());
        try {
            Path targetLocation = Paths.get(uploadDir).resolve(subDir);
            Files.createDirectories(targetLocation);
            Path filePath = targetLocation.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + subDir + "/" + fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void deleteFile(String filePath) {
        if (filePath != null && filePath.startsWith("/uploads/")) {
            try {
                Path p = Paths.get(uploadDir).resolve(filePath.replace("/uploads/", ""));
                Files.deleteIfExists(p);
            } catch (IOException ex) {
                throw new FileStorageException("Could not delete file " + filePath, ex);
            }
        }
    }

    public void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/jpg"))) {
            throw new FileStorageException("Only JPG, JPEG and PNG files are allowed");
        }
    }

    public void compressImage(MultipartFile file) {
        // Simple mock implementation for now
        // In real life, use ImageIO to write with compression quality 0.7
    }
}
