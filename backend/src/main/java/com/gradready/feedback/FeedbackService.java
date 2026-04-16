package com.gradready.feedback;

import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public void submit(String email, FeedbackRequest req) {
        var user = userRepository.findByEmail(email).orElse(null);

        var feedback = Feedback.builder()
                .user(user)
                .type(req.getType() != null ? req.getType().toUpperCase() : "OTHER")
                .message(req.getMessage())
                .pageUrl(req.getPageUrl())
                .build();

        feedbackRepository.save(feedback);
    }
}
