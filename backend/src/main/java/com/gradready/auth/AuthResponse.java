package com.gradready.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data @Builder @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String fullName;
    private UUID userId;
    private String course;
    private String region;
}