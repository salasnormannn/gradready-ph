package com.gradready.tracker;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tracker")
@RequiredArgsConstructor
public class JobTrackerController {

    private final JobTrackerService service;

    @GetMapping
    public ResponseEntity<List<JobApplicationResponse>> getAll(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(service.getAll(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> create(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody JobApplicationRequest req) {
        return ResponseEntity.ok(service.create(user.getUsername(), req));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> update(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable UUID id,
            @RequestBody JobApplicationRequest req) {
        return ResponseEntity.ok(service.update(user.getUsername(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable UUID id) {
        service.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(service.getStats(user.getUsername()));
    }
}