package com.gradready.feedback;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService service;

    @PostMapping
    public ResponseEntity<Void> submit(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody FeedbackRequest req) {
        service.submit(userDetails.getUsername(), req);
        return ResponseEntity.ok().build();
    }
}
