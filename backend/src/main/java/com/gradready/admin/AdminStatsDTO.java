package com.gradready.admin;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data @Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long newThisWeek;
    private long newThisMonth;
    private long feedbackTotal;
    private Map<String, Long> feedbackByType;
}
