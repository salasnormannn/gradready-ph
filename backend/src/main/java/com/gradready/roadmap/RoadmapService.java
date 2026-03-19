package com.gradready.roadmap;

import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    public List<RoadmapItemResponse> getRoadmap(String email) {
        User user = getUser(email);
        if (!roadmapRepository.existsByUserId(user.getId())) {
            generateRoadmap(user);
        }
        return roadmapRepository.findByUserIdOrderByWeekNumberAsc(user.getId())
                .stream().map(RoadmapItemResponse::from).toList();
    }

    public RoadmapItemResponse toggleComplete(String email, UUID itemId) {
        User user = getUser(email);
        RoadmapItem item = roadmapRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        item.setCompleted(!item.isCompleted());
        item.setCompletedAt(item.isCompleted() ? LocalDateTime.now() : null);
        return RoadmapItemResponse.from(roadmapRepository.save(item));
    }

    public Map<String, Object> getProgress(String email) {
        User user = getUser(email);
        long total = roadmapRepository.countByUserId(user.getId());
        long done = roadmapRepository.countByUserIdAndCompletedTrue(user.getId());
        int pct = total > 0 ? (int) Math.round((done * 100.0) / total) : 0;
        return Map.of("total", total, "completed", done, "percentage", pct);
    }

    @Transactional
    private void generateRoadmap(User user) {
        List<RoadmapItem> items = new ArrayList<>();
        String status = user.getStatus() != null ? user.getStatus() : "job_hunting";
        String course = user.getCourse() != null ? user.getCourse().toLowerCase() : "";
        boolean isBoardExam = course.contains("nursing") || course.contains("engineering")
                || course.contains("accountancy") || course.contains("architecture")
                || course.contains("medicine") || course.contains("pharmacy");

        // Week 1-2: Government registrations (everyone)
        items.add(build(user, "Register for TIN (BIR)",
                "Get your Tax Identification Number — required for employment and freelancing. Visit your nearest BIR Revenue District Office or register online.", "government", 1));
        items.add(build(user, "Create SSS online account",
                "Register at My.SSS portal (my.sss.gov.ph). You'll need a valid ID and your personal details. SSS provides social security benefits.", "government", 1));
        items.add(build(user, "Get NBI Clearance",
                "Book an appointment at nbi.gov.ph. Bring a valid ID and payment of ₱130. Required for most job applications.", "government", 2));
        items.add(build(user, "Register for PhilHealth",
                "Fill out the PMRF form at any PhilHealth office or register online. Provides health insurance coverage.", "government", 2));

        // Week 3-4: Career & Finance (everyone)
        items.add(build(user, "Register for Pag-IBIG (HDMF)",
                "Register at any Pag-IBIG branch or online. Provides housing loan eligibility and MP2 savings program.", "government", 3));
        items.add(build(user, "Apply for PhilSys National ID",
                "Register at your nearest PSA office. Serves as a universal government ID.", "government", 3));
        items.add(build(user, "Open a savings account",
                "Open a bank account for your salary. Consider BPI, BDO, or digital options like GCash GSave or Maya Savings.", "finance", 3));

        // Job hunting specific
        if (status.equals("job_hunting") || status.equals("employed")) {
            items.add(build(user, "Polish your resume",
                    "Use the GradReady Resume Builder to create an ATS-optimized resume tailored to your course and target industry.", "career", 4));
            items.add(build(user, "Apply to at least 10 jobs",
                    "Use the GradReady Job Search to find AI-matched openings. Aim for 10 applications in your first week of hunting.", "career", 4));
            items.add(build(user, "Prepare for interviews",
                    "Research common interview questions for your industry. Ask Kuya AI for mock interview practice.", "career", 5));
        }

        // Board exam specific
        if (isBoardExam && status.equals("board_exam")) {
            items.add(build(user, "Check PRC exam schedule",
                    "Visit prc.gov.ph for the latest licensure exam schedules. Set up your Board Exam Tracker in GradReady.", "board_exam", 4));
            items.add(build(user, "Enroll in a review center",
                    "Research review centers in your area. Ask Kuya AI for recommendations based on your course.", "board_exam", 4));
            items.add(build(user, "Create a study plan",
                    "Use the GradReady Board Exam Tracker to generate a personalized study plan based on your exam date.", "board_exam", 5));
        }

        // Month 2+ Financial literacy
        items.add(build(user, "Learn about your payslip deductions",
                "Understand SSS, PhilHealth, Pag-IBIG, and withholding tax deductions. Ask Kuya AI to explain your first payslip.", "finance", 6));
        items.add(build(user, "Set up your emergency fund",
                "Aim to save 3-6 months of expenses. Start with whatever you can — even ₱500/month makes a difference.", "finance", 7));
        items.add(build(user, "Start investing",
                "Explore Pag-IBIG MP2, UITF, or COL Financial for stocks. Ask Kuya AI about investing for Filipino beginners.", "finance", 8));

        roadmapRepository.saveAll(items);
    }

    private RoadmapItem build(User user, String title, String description,
                              String category, int week) {
        return RoadmapItem.builder()
                .user(user)
                .title(title)
                .description(description)
                .category(category)
                .weekNumber(week)
                .completed(false)
                .build();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}