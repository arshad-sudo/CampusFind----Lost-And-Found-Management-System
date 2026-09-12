package com.campus.lostandfound.service.impl;

import com.campus.lostandfound.entity.FoundItem;
import com.campus.lostandfound.entity.LostItem;
import com.campus.lostandfound.enums.ReportFormat;
import com.campus.lostandfound.enums.ReportType;
import com.campus.lostandfound.repository.FoundItemRepository;
import com.campus.lostandfound.repository.LostItemRepository;
import com.campus.lostandfound.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;

    @Override
    public byte[] generateReport(String userEmail, ReportType type, ReportFormat format, LocalDate dateFrom, LocalDate dateTo) {
        List<LostItem> lostItems = lostItemRepository.findAll();
        List<FoundItem> foundItems = foundItemRepository.findAll();

        if (format == ReportFormat.CSV) {
            StringBuilder sb = new StringBuilder();
            sb.append("Type,ID,Item Name,Status,Created At\n");
            for (LostItem item : lostItems) {
                sb.append("LOST,").append(item.getId()).append(",\"")
                        .append(item.getItemName()).append("\",")
                        .append(item.getStatus()).append(",")
                        .append(item.getCreatedAt()).append("\n");
            }
            for (FoundItem item : foundItems) {
                sb.append("FOUND,").append(item.getId()).append(",\"")
                        .append(item.getItemName()).append("\",")
                        .append(item.getStatus()).append(",")
                        .append(item.getCreatedAt()).append("\n");
            }
            return sb.toString().getBytes(StandardCharsets.UTF_8);
        } else {
            // Default placeholder binary data (e.g. PDF/Excel stream mock)
            String content = "Campus Lost & Found Report (" + type + ")\nGenerated for: " + userEmail + "\nTotal Lost Items: " + lostItems.size() + "\nTotal Found Items: " + foundItems.size();
            return content.getBytes(StandardCharsets.UTF_8);
        }
    }
}
