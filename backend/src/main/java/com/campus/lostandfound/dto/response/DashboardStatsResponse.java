package com.campus.lostandfound.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalLostItems;
    private long totalFoundItems;
    private long pendingClaims;
    private long returnedItems;
    private long activeUsers;
}
