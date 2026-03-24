package com.gradready.boardexam;

import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board-exam")
@RequiredArgsConstructor
public class BoardExamController {

    private final ChatClient.Builder chatClientBuilder;
    private final UserRepository userRepository;

    @GetMapping("/schedules")
    public ResponseEntity<List<Map<String, String>>> getSchedules(
            @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        return ResponseEntity.ok(getSchedulesForCourse(user.getCourse()));
    }

    @PostMapping("/study-plan")
    public ResponseEntity<Map<String, String>> generateStudyPlan(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> body) {
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        String examDate = body.get("examDate");
        String weakSubjects = body.getOrDefault("weakSubjects", "");

        String plan = chatClientBuilder
                .defaultOptions(
                        org.springframework.ai.openai.OpenAiChatOptions.builder()
                                .model("gpt-4o-mini")
                                .temperature(0.7)
                                .maxTokens(800)
                                .build()
                )
                .build()
                .prompt()
                .system("""
                    You are a board exam coach for Filipino professionals.
                    Create a practical, week-by-week study plan.
                    Be specific with topics and hours per day.
                    Keep it motivating and realistic for a fresh grad.
                    Format clearly with Week 1, Week 2, etc.
                    Maximum 400 words.
                    """)
                .user("Create a study plan for " + user.getCourse()
                        + " board exam. Exam date: " + examDate
                        + (weakSubjects.isEmpty() ? "" : ". Weak subjects: " + weakSubjects))
                .call()
                .content();

        return ResponseEntity.ok(Map.of("studyPlan", plan));
    }

    private List<Map<String, String>> getSchedulesForCourse(String course) {
        if (course == null) return getGeneralSchedules();
        String c = course.toLowerCase();
        if (c.contains("nursing")) return List.of(
                Map.of("exam", "NLE (Nursing Licensure Exam)",
                        "schedule", "June and December",
                        "fee", "P900", "venue", "Various PRC testing centers",
                        "subjects", "Fundamentals, Med-Surg, Community Health, Maternal, Psychiatric"),
                Map.of("exam", "NLE Review Registration",
                        "schedule", "3-4 months before exam",
                        "fee", "P8,000-P15,000", "venue", "Review centers nationwide",
                        "subjects", "Full NLE coverage")
        );
        if (c.contains("accountancy")) return List.of(
                Map.of("exam", "CPALE (CPA Licensure Exam)",
                        "schedule", "May and October",
                        "fee", "P1,500", "venue", "Various PRC testing centers",
                        "subjects", "FAR, AFAR, MAS, AT, Taxation, RFBT")
        );
        if (c.contains("civil engineering")) return List.of(
                Map.of("exam", "Civil Engineering Board Exam",
                        "schedule", "May and November",
                        "fee", "P900", "venue", "Various PRC testing centers",
                        "subjects", "Math, Surveying, Hydraulics, Structural, Geotechnical")
        );
        if (c.contains("electrical engineering")) return List.of(
                Map.of("exam", "Electrical Engineering Board Exam",
                        "schedule", "April and September",
                        "fee", "P900", "venue", "Various PRC testing centers",
                        "subjects", "Math, Electrical Engineering, Electronics")
        );
        if (c.contains("architecture")) return List.of(
                Map.of("exam", "Architecture Board Exam (ARE)",
                        "schedule", "June and December",
                        "fee", "P900", "venue", "Various PRC testing centers",
                        "subjects", "Design, History, Utilities, Construction, Professional Practice")
        );
        if (c.contains("education")) return List.of(
                Map.of("exam", "LET (Licensure Exam for Teachers)",
                        "schedule", "March and September",
                        "fee", "P900", "venue", "Various PRC testing centers",
                        "subjects", "Professional Education, General Education, Specialization")
        );
        if (c.contains("medicine")) return List.of(
                Map.of("exam", "Physician Licensure Exam",
                        "schedule", "February and August",
                        "fee", "P1,500", "venue", "Various PRC testing centers",
                        "subjects", "All medical subjects")
        );
        return getGeneralSchedules();
    }

    private List<Map<String, String>> getGeneralSchedules() {
        return List.of(
                Map.of("exam", "Various PRC Board Exams",
                        "schedule", "Check prc.gov.ph for your specific profession",
                        "fee", "P900-P1,500", "venue", "PRC testing centers nationwide",
                        "subjects", "Varies by profession")
        );
    }
}