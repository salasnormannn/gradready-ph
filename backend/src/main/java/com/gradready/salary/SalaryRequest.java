package com.gradready.salary;

import lombok.Data;

@Data
public class SalaryRequest {
    private String jobTitle;
    private String company;
    private String industry;
    private Integer monthlySalary;
    private Integer yearsExp;
    private String region;
    private String course;
    private String workSetup;
    private Boolean isAnonymous;
}