package com.gradready.admin;

import com.gradready.feedback.Feedback;
import com.gradready.feedback.FeedbackRepository;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    public AdminStatsDTO getStats() {
        long totalUsers = userRepository.count() - 1; // exclude admin account
        long newThisWeek  = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusWeeks(1));
        long newThisMonth = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusMonths(1));
        long feedbackTotal = feedbackRepository.count();

        Map<String, Long> byType = Map.of(
                "BUG",           feedbackRepository.countByType("BUG"),
                "SUGGESTION",    feedbackRepository.countByType("SUGGESTION"),
                "CONTENT_ERROR", feedbackRepository.countByType("CONTENT_ERROR"),
                "OTHER",         feedbackRepository.countByType("OTHER")
        );

        return AdminStatsDTO.builder()
                .totalUsers(totalUsers)
                .newThisWeek(newThisWeek)
                .newThisMonth(newThisMonth)
                .feedbackTotal(feedbackTotal)
                .feedbackByType(byType)
                .build();
    }

    public List<FeedbackItemDTO> getFeedback(String type) {
        var list = (type != null && !type.isBlank())
                ? feedbackRepository.findByTypeWithUser(type.toUpperCase())
                : feedbackRepository.findAllWithUser();

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public FeedbackItemDTO resolve(UUID id) {
        Feedback f = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
        f.setResolved(true);
        f.setResolvedAt(LocalDateTime.now());
        return toDTO(feedbackRepository.save(f));
    }

    private FeedbackItemDTO toDTO(Feedback f) {
        return FeedbackItemDTO.builder()
                .id(f.getId())
                .type(f.getType())
                .message(f.getMessage())
                .pageUrl(f.getPageUrl())
                .userEmail(f.getUser() != null ? f.getUser().getEmail() : "anonymous")
                .userFullName(f.getUser() != null ? f.getUser().getFullName() : "—")
                .createdAt(f.getCreatedAt())
                .resolved(f.isResolved())
                .resolvedAt(f.getResolvedAt())
                .build();
    }

    public List<RecentUserDTO> getRecentUsers() {
        return userRepository.findTop10ByIsAdminFalseOrderByCreatedAtDesc().stream()
                .map(u -> RecentUserDTO.builder()
                        .email(u.getEmail())
                        .fullName(u.getFullName())
                        .course(u.getCourse())
                        .region(u.getRegion())
                        .createdAt(u.getCreatedAt())
                        .build()
                ).collect(Collectors.toList());
    }
}
