package com.gradready.job;

import lombok.Data;
import java.util.List;

@Data
public class ResumeRequest {
    private String targetRole;
    private String targetIndustry;
    private List<String> skills;
    private List<String> experiences;
    private List<String> projects;
    private String summary;
}