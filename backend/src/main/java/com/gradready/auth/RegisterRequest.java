package com.gradready.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String fullName;

    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 8)
    private String password;

    private String course;
    private Integer graduationYear;
    private String region;
    private String school;
}