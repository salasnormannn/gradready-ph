package com.gradready.job;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<JobSearchResponse> searchJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "1") Integer page) {
        JobSearchRequest request = new JobSearchRequest();
        request.setQuery(query);
        request.setLocation(location);
        request.setPage(page);
        return ResponseEntity.ok(
                jobService.searchJobs(userDetails.getUsername(), request));
    }

    @PostMapping("/analyze")
    public ResponseEntity<JobResult> analyzeRedFlags(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                jobService.analyzeRedFlags(
                        userDetails.getUsername(),
                        body.get("description")));
    }

    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> generateResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ResumeRequest request) {
        String resume = jobService.generateResume(
                userDetails.getUsername(), request);
        return ResponseEntity.ok(Map.of("resume", resume));
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<Map<String, String>> generateCoverLetter(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        String letter = jobService.generateCoverLetter(
                userDetails.getUsername(),
                body.get("jobTitle"),
                body.get("company"),
                body.get("jobDescription"));
        return ResponseEntity.ok(Map.of("coverLetter", letter));
    }
}