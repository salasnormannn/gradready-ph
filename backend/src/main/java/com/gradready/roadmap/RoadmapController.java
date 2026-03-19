package com.gradready.roadmap;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<List<RoadmapItemResponse>> getRoadmap(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                roadmapService.getRoadmap(userDetails.getUsername()));
    }

    @PatchMapping("/{itemId}/toggle")
    public ResponseEntity<RoadmapItemResponse> toggleComplete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID itemId) {
        return ResponseEntity.ok(
                roadmapService.toggleComplete(userDetails.getUsername(), itemId));
    }

    @GetMapping("/progress")
    public ResponseEntity<Map<String, Object>> getProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                roadmapService.getProgress(userDetails.getUsername()));
    }
}