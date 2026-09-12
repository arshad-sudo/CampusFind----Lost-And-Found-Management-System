package com.campus.lostandfound.service;

import com.campus.lostandfound.enums.ReportFormat;
import com.campus.lostandfound.enums.ReportType;

import java.time.LocalDate;

public interface ReportService {
    byte[] generateReport(String userEmail, ReportType type, ReportFormat format, LocalDate dateFrom, LocalDate dateTo);
}
