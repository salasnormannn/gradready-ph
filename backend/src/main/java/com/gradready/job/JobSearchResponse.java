package com.gradready.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class JobSearchResponse {
    private List<JobResult> jobs;
    private Integer total;
    private Integer page;
    private String query;
}