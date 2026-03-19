package com.gradready.roadmap;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class RoadmapItemResponse {
    private UUID id;
    private String title;
    private String description;
    private String category;
    private Integer weekNumber;
    private boolean completed;
    private LocalDateTime completedAt;

    public static RoadmapItemResponse from(RoadmapItem item) {
        return RoadmapItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .category(item.getCategory())
                .weekNumber(item.getWeekNumber())
                .completed(item.isCompleted())
                .completedAt(item.getCompletedAt())
                .build();
    }
}