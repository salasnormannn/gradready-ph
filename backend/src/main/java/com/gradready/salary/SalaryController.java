package com.gradready.salary;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService service;

    @PostMapping
    public ResponseEntity<SalarySubmission> submit(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody SalaryRequest req) {
        return ResponseEntity.ok(service.submit(user.getUsername(), req));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SalaryResponse>> search(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String jobTitle) {
        return ResponseEntity.ok(service.search(company, industry, jobTitle));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats(
            @RequestParam String industry) {
        return ResponseEntity.ok(service.getStats(industry));
    }

    @GetMapping("/industries")
    public ResponseEntity<List<String>> industries() {
        return ResponseEntity.ok(service.getIndustries());
    }
}git checkoutgit add .git commit -Mm "Front end adjustments"git push origin featrure/