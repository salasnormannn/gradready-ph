package com.gradready.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(service.getStats());
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<FeedbackItemDTO>> getFeedback(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(service.getFeedback(type));
    }

    @GetMapping("/users/recent")
    public ResponseEntity<List<RecentUserDTO>> getRecentUsers() {
        return ResponseEntity.ok(service.getRecentUsers());
    }

    @PatchMapping("/feedback/{id}/resolve")
    public ResponseEntity<FeedbackItemDTO> resolve(@PathVariable UUID id) {
        return ResponseEntity.ok(service.resolve(id));
    }
}
