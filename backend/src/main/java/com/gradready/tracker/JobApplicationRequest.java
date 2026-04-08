package com.gradready.tracker;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobApplicationRequest {
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
}