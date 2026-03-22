package com.gradready.roadmap;

import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    public List<RoadmapItemResponse> getRoadmap(String email) {
        User user = getUser(email);
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
    public void generateRoadmapForUser(User user) {
        // Delete existing roadmap first so it regenerates fresh
        roadmapRepository.deleteByUserId(user.getId());
        List<RoadmapItem> items = buildRoadmap(user);
        roadmapRepository.saveAll(items);
        log.info("Generated {} roadmap items for user {}", items.size(), user.getEmail());
    }

    private List<RoadmapItem> buildRoadmap(User user) {
        List<RoadmapItem> items = new ArrayList<>();
        String status = user.getStatus() != null ? user.getStatus() : "job_hunting";
        String course = user.getCourse() != null ? user.getCourse().toLowerCase() : "";

        boolean isIT = course.contains("computer science") || course.contains("information technology")
                || course.contains("computer engineering");
        boolean isNursing = course.contains("nursing");
        boolean isCPA = course.contains("accountancy");
        boolean isEngineering = course.contains("engineering");
        boolean isArchitecture = course.contains("architecture");
        boolean isMedicine = course.contains("medicine") || course.contains("pharmacy");
        boolean isEducation = course.contains("education");
        boolean isBoardExam = isNursing || isCPA || isEngineering || isArchitecture || isMedicine || isEducation;

        // ── WEEK 1-2: Government registrations (ALL statuses) ──
        items.add(build(user, "Register for TIN (BIR)",
                "Get your Tax Identification Number — required for employment and freelancing. "
                        + "Visit your nearest BIR Revenue District Office or register via eReg at bir.gov.ph.",
                "government", 1));
        items.add(build(user, "Create SSS online account",
                "Register at my.sss.gov.ph. You'll need a valid ID. SSS provides sickness, maternity, "
                        + "disability, retirement, and death benefits.",
                "government", 1));
        items.add(build(user, "Get NBI Clearance",
                "Book appointment at clearance.nbi.gov.ph. Bring valid ID and payment of P155. "
                        + "Required for most job applications in the Philippines.",
                "government", 2));
        items.add(build(user, "Register for PhilHealth",
                "Fill out PMRF form at any PhilHealth office or online at philhealth.gov.ph. "
                        + "Provides health insurance coverage for you and your dependents.",
                "government", 2));
        items.add(build(user, "Register for Pag-IBIG (HDMF)",
                "Register at pagibigfund.gov.ph or any Pag-IBIG branch. "
                        + "Provides housing loan eligibility and MP2 savings program.",
                "government", 3));
        items.add(build(user, "Apply for PhilSys National ID",
                "Register at your nearest PSA office or LGU. "
                        + "Serves as a universal government ID accepted everywhere.",
                "government", 3));
        items.add(build(user, "Open a savings account",
                "Open a bank account for your salary. Consider BPI or BDO for traditional banking, "
                        + "or GCash GSave / Maya Savings for higher interest digital banking.",
                "finance", 3));

        // ── STATUS-BASED ROADMAP ──
        switch (status) {

            case "job_hunting" -> {
                items.add(build(user, "Polish your resume",
                        "Use the GradReady Resume Builder to create an ATS-optimized resume. "
                                + "Highlight your projects, skills, and academic achievements.",
                        "career", 4));
                items.add(build(user, "Set up LinkedIn profile",
                        "Create or update your LinkedIn profile. Add your education, skills, "
                                + "and a professional photo. Connect with classmates and professors.",
                        "career", 4));
                items.add(build(user, "Apply to at least 10 jobs",
                        "Use GradReady Job Search to find AI-matched openings on Kalibrr, JobStreet, "
                                + "and LinkedIn. Aim for 10 applications in your first week of hunting.",
                        "career", 4));
                items.add(build(user, "Prepare for interviews",
                        "Research common interview questions for your industry. "
                                + "Practice the STAR method. Ask Kuya AI for mock interview practice.",
                        "career", 5));
                items.add(build(user, "Negotiate your first salary",
                        "Research market rates for your role in your region. "
                                + "For NCR IT roles: P25,000-P40,000 entry level. Never accept the first offer without asking.",
                        "career", 5));
                if (isIT) {
                    items.add(build(user, "Build your GitHub portfolio",
                            "Create or clean up your GitHub profile. Pin 3-5 projects. "
                                    + "Recruiters check GitHub for IT applicants.",
                            "career", 5));
                    items.add(build(user, "Get AWS Cloud Practitioner or Google cert",
                            "Entry-level cloud certifications significantly boost your hireability. "
                                    + "AWS Cloud Practitioner costs $100 and takes 1-2 months to prepare.",
                            "career", 7));
                }
                if (isEngineering) {
                    items.add(build(user, "Prepare your engineering portfolio",
                            "Compile your thesis, CAD drawings, lab reports, or project documentation. "
                                    + "Engineering firms often request portfolio during application.",
                            "career", 5));
                }
            }

            case "employed" -> {
                items.add(build(user, "Understand your first payslip",
                        "Learn about SSS, PhilHealth, Pag-IBIG, and withholding tax deductions. "
                                + "Ask Kuya AI to explain each deduction on your payslip.",
                        "finance", 4));
                items.add(build(user, "Set up emergency fund",
                        "Save 3-6 months of expenses. Start with at least P1,000/month. "
                                + "Keep it in a high-yield savings account like Maya or GCash GSave.",
                        "finance", 4));
                items.add(build(user, "Start Pag-IBIG MP2 savings",
                        "Voluntary savings program with 6-7% annual dividend — better than any bank. "
                                + "Minimum P500/month. Apply at pagibigfund.gov.ph.",
                        "finance", 5));
                items.add(build(user, "Apply for company HMO",
                        "Check if your employer provides HMO on top of PhilHealth. "
                                + "Ask HR about HMO coverage and how to enroll your dependents.",
                        "finance", 4));
                items.add(build(user, "File your first ITR (if needed)",
                        "If you have two employers in a year or mixed income, you must file ITR. "
                                + "Deadline: April 15 each year. Ask Kuya AI if you need to file.",
                        "finance", 6));
                items.add(build(user, "Start investing",
                        "Explore UITF at BPI/BDO (minimum P1,000), GInvest via GCash (P50), "
                                + "or COL Financial for stocks. Ask Kuya AI about beginner investing.",
                        "finance", 8));
            }

            case "freelancing" -> {
                items.add(build(user, "Register as self-employed at BIR",
                        "File BIR Form 1901 at your RDO to register as self-employed. "
                                + "You'll need this to issue official receipts and file taxes.",
                        "government", 4));
                items.add(build(user, "Get Official Receipt (OR) book",
                        "Purchase OR booklet from BIR-accredited printer after registration. "
                                + "Required to issue receipts to clients.",
                        "government", 4));
                items.add(build(user, "Set up freelance profiles",
                        "Create accounts on Upwork, Fiverr, and OnlineJobs.ph. "
                                + "Write a compelling bio highlighting your skills and experience.",
                        "career", 5));
                items.add(build(user, "Set your freelance rates",
                        "Research market rates for your skill set. "
                                + "PH developers: $15-40/hr on Upwork. Ask Kuya AI for rate guidance.",
                        "career", 5));
                items.add(build(user, "File quarterly income tax",
                        "Self-employed individuals must file BIR Form 1701Q every quarter. "
                                + "Deadlines: May 15, Aug 15, Nov 15. Keep all receipts.",
                        "finance", 6));
                items.add(build(user, "Pay SSS as voluntary member",
                        "Self-employed members pay both employee and employer SSS shares. "
                                + "Pay monthly via GCash, Bayad Center, or SSS branches.",
                        "government", 5));
            }

            case "board_exam" -> {
                items.add(build(user, "Check PRC exam schedule",
                        "Visit prc.gov.ph for the latest licensure exam schedules for your profession. "
                                + "Set up your Board Exam Tracker in GradReady.",
                        "board_exam", 4));
                items.add(build(user, "Register for the board exam",
                        "Create PRC online account and submit application at prc.gov.ph. "
                                + "Prepare: TOR, birth certificate, good moral certificate, 2x2 photos.",
                        "board_exam", 4));
                items.add(build(user, "Enroll in a review center",
                        "Research review centers in your area. Compare prices and pass rates. "
                                + "Ask Kuya AI for review center recommendations for your profession.",
                        "board_exam", 4));
                items.add(build(user, "Create a study plan",
                        "Use GradReady Board Exam Tracker to generate a personalized study plan "
                                + "based on your exam date and weak subjects.",
                        "board_exam", 5));
                if (isNursing) {
                    items.add(build(user, "Prepare for NLE (Nursing Licensure Exam)",
                            "NLE covers: Fundamentals, Community Health, Medical-Surgical, "
                                    + "Maternal & Child, Psychiatric Nursing. Focus on priority questions.",
                            "board_exam", 5));
                }
                if (isCPA) {
                    items.add(build(user, "Prepare for CPA board exam",
                            "CPA covers: FAR, Management Advisory Services, Auditing, Taxation, "
                                    + "and Business Law. Start with your weakest subject.",
                            "board_exam", 5));
                }
                if (isEngineering) {
                    items.add(build(user, "Prepare for Engineering board exam",
                            "Review mathematics, engineering sciences, and professional practice. "
                                    + "Get past board exam questions from PRC or your review center.",
                            "board_exam", 5));
                }
                items.add(build(user, "After passing: Get PRC ID",
                        "After passing, register your Certificate of Registration at PRC. "
                                + "Take your oath-taking ceremony and receive your professional ID card.",
                        "board_exam", 8));
            }

            case "further_studies" -> {
                items.add(build(user, "Research graduate schools",
                        "Compare graduate programs in the Philippines and abroad. "
                                + "Check CHED scholarships and DOST-SEI grants for local grad school.",
                        "career", 4));
                items.add(build(user, "Prepare application requirements",
                        "Gather: TOR, diploma, recommendation letters, statement of purpose, "
                                + "and test scores (NMAT, GMAT, GRE depending on program).",
                        "career", 4));
                items.add(build(user, "Apply for CHED scholarships",
                        "CHED offers scholarships for graduate studies. Visit ched.gov.ph "
                                + "for available programs and application deadlines.",
                        "career", 5));
                items.add(build(user, "Look for part-time work",
                        "Consider teaching assistant, research assistant, or part-time roles "
                                + "to support your studies. Use GradReady Job Search for flexible roles.",
                        "career", 5));
            }
        }

        // ── MONTH 2+: Financial literacy (ALL statuses) ──
        items.add(build(user, "Learn about your tax obligations",
                "Understand how income tax works in the Philippines. "
                        + "Employees earning under P250,000/year are tax-exempt under TRAIN Law.",
                "finance", 6));
        items.add(build(user, "Set up 50/30/20 budget",
                "50% needs, 30% wants, 20% savings/investments. "
                        + "Ask Kuya AI to help you create a budget based on your salary.",
                "finance", 7));
        items.add(build(user, "Start investing for the future",
                "Begin with Pag-IBIG MP2 (safest, 6-7% dividend), then explore UITF and stocks. "
                        + "Time in the market beats timing the market.",
                "finance", 8));

        return items;
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