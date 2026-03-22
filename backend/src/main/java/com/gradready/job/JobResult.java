package com.gradready.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobResult {
    private String id;
    private String title;
    private String company;
    private String location;
    private String employmentType;
    private String salaryMin;
    private String salaryMax;
    private String salaryCurrency;
    private String description;
    private String applyLink;
    private String postedAt;
    private Integer fitScore;
    private String fitReason;
    private Boolean hasRedFlags;
    private String redFlagSummary;
}