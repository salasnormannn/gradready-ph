package com.gradready.admin;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class RecentUserDTO {
    private String email;
    private String fullName;
    private String course;
    private String region;
    private LocalDateTime createdAt;
}
