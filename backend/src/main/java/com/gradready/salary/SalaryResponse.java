package com.gradready.salary;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SalaryResponse {
    private UUID id;
    private String jobTitle;
    private String company;
    private String industry;
    private Integer monthlySalary;
    private Integer yearsExp;
    private String region;
    private String workSetup;
    private LocalDateTime createdAt;

    public static SalaryResponse from(SalarySubmission s) {
        return SalaryResponse.builder()
                .id(s.getId())
                .jobTitle(s.getJobTitle())
                .company(s.getCompany())
                .industry(s.getIndustry())
                .monthlySalary(s.getMonthlySalary())
                .yearsExp(s.getYearsExp())
                .region(s.getRegion())
                .workSetup(s.getWorkSetup())
                .createdAt(s.getCreatedAt())
                .build();
    }
}