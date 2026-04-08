package com.gradready.tracker;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobApplicationResponse {
    private UUID id;
    private String company;
    private String role;
    private String jobUrl;
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String workSetup;
    private String status;
    private LocalDate appliedDate;
    private LocalDateTime interviewDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static JobApplicationResponse from(JobApplication app) {
        return JobApplicationResponse.builder()
                .id(app.getId())
                .company(app.getCompany())
                .role(app.getRole())
                .jobUrl(app.getJobUrl())
                .salaryMin(app.getSalaryMin())
                .salaryMax(app.getSalaryMax())
                .location(app.getLocation())
                .workSetup(app.getWorkSetup())
                .status(app.getStatus().name())
                .appliedDate(app.getAppliedDate())
                .interviewDate(app.getInterviewDate())
                .notes(app.getNotes())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}