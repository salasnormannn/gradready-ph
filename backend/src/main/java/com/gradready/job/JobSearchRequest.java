package com.gradready.job;

import lombok.Data;

@Data
public class JobSearchRequest {
    private String query;
    private String location;
    private String employmentType;
    private Integer page = 1;
}