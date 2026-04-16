package com.gradready.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private UUID userId;
    private String course;
    private String region;
    private String school;
    private String status;
    @JsonProperty("isAdmin")
    private boolean isAdmin;
}