package com.gradready.tracker;

import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobTrackerService {

    private final JobApplicationRepository repository;
    private final UserRepository userRepository;

    public List<JobApplicationResponse> getAll(String email) {
        User user = getUser(email);
        return repository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream().map(JobApplicationResponse::from).toList();
    }

    public JobApplicationResponse create(String email, JobApplicationRequest req) {
        User user = getUser(email);
        JobApplication app = JobApplication.builder()
                .user(user)
                .company(req.getCompany())
                .role(req.getRole())
                .jobUrl(req.getJobUrl())
                .salaryMin(req.getSalaryMin())
                .salaryMax(req.getSalaryMax())
                .location(req.getLocation())
                .workSetup(req.getWorkSetup())
                .status(parseStatus(req.getStatus(), JobApplication.ApplicationStatus.APPLIED))
                .appliedDate(req.getAppliedDate() != null ? req.getAppliedDate() : LocalDate.now())
                .interviewDate(req.getInterviewDate())
                .notes(req.getNotes())
                .build();
        return JobApplicationResponse.from(repository.save(app));
    }

    public JobApplicationResponse update(String email, UUID id, JobApplicationRequest req) {
        User user = getUser(email);
        JobApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!app.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");

        if (req.getCompany() != null) app.setCompany(req.getCompany());
        if (req.getRole() != null) app.setRole(req.getRole());
        if (req.getJobUrl() != null) app.setJobUrl(req.getJobUrl());
        if (req.getSalaryMin() != null) app.setSalaryMin(req.getSalaryMin());
        if (req.getSalaryMax() != null) app.setSalaryMax(req.getSalaryMax());
        if (req.getLocation() != null) app.setLocation(req.getLocation());
        if (req.getWorkSetup() != null) app.setWorkSetup(req.getWorkSetup());
        if (req.getStatus() != null) app.setStatus(parseStatus(req.getStatus(), app.getStatus()));
        if (req.getAppliedDate() != null) app.setAppliedDate(req.getAppliedDate());
        if (req.getInterviewDate() != null) app.setInterviewDate(req.getInterviewDate());
        if (req.getNotes() != null) app.setNotes(req.getNotes());
        app.setUpdatedAt(LocalDateTime.now());

        return JobApplicationResponse.from(repository.save(app));
    }

    public void delete(String email, UUID id) {
        User user = getUser(email);
        JobApplication app = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        if (!app.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        repository.delete(app);
    }

    public Map<String, Object> getStats(String email) {
        User user = getUser(email);
        UUID uid = user.getId();
        return Map.of(
                "total", repository.countByUserId(uid),
                "applied", repository.countByUserIdAndStatus(uid, JobApplication.ApplicationStatus.APPLIED),
                "interview", repository.countByUserIdAndStatus(uid, JobApplication.ApplicationStatus.INTERVIEW),
                "offer", repository.countByUserIdAndStatus(uid, JobApplication.ApplicationStatus.OFFER),
                "rejected", repository.countByUserIdAndStatus(uid, JobApplication.ApplicationStatus.REJECTED),
                "ghosted", repository.countByUserIdAndStatus(uid, JobApplication.ApplicationStatus.GHOSTED),
                "accepted", repository.countByUserIdAndStatus(uid, JobApplication.ApplicationStatus.ACCEPTED)
        );
    }

    private JobApplication.ApplicationStatus parseStatus(String s, JobApplication.ApplicationStatus fallback) {
        if (s == null) return fallback;
        try { return JobApplication.ApplicationStatus.valueOf(s.toUpperCase()); }
        catch (Exception e) { return fallback; }
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}