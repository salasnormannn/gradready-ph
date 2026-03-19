package com.gradready.user;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String course;
    private String school;
    private String graduationYear;
    private String region;
    private String status;
}