package com.gradready.tracker;

import com.gradready.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_applications")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobApplication {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String company;
    private String role;
    private String jobUrl;
    private Integer salaryMin;
    private Integer salaryMax;
    private String location;
    private String workSetup;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private LocalDate appliedDate;
    private LocalDateTime interviewDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ApplicationStatus {
        WISHLIST, APPLIED, INTERVIEW, OFFER, REJECTED, GHOSTED, ACCEPTED
    }
}