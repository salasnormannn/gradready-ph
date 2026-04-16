package com.gradready.admin;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class FeedbackItemDTO {
    private UUID id;
    private String type;
    private String message;
    private String pageUrl;
    private String userEmail;
    private String userFullName;
    private LocalDateTime createdAt;
    @JsonProperty("resolved")
    private boolean resolved;
    private LocalDateTime resolvedAt;
}
