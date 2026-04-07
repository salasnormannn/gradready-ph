package com.gradready.tracker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByUserIdOrderByUpdatedAtDesc(UUID userId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.user.id = :userId AND a.status = :status")
    long countByUserIdAndStatus(UUID userId, JobApplication.ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.user.id = :userId")
    long countByUserId(UUID userId);
}