package com.gradready.salary;

import com.gradready.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "salary_submissions")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SalarySubmission {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String jobTitle;
    private String company;
    private String industry;
    private Integer monthlySalary;
    private Integer yearsExp;
    private String region;
    private String course;
    private String workSetup;
    private Boolean isAnonymous = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}