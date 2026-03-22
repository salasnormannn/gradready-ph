package com.gradready.job;

import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;
    private final RestTemplate restTemplate;

    @Value("${jsearch.api.key:placeholder}")
    private String jsearchApiKey;

    @Value("${jsearch.api.host:jsearch.p.rapidapi.com}")
    private String jsearchApiHost;

    public JobSearchResponse searchJobs(String email, JobSearchRequest request) {
        User user = getUser(email);
        String query = buildQuery(request, user);
        List<JobResult> jobs = fetchFromJSearch(query, request.getPage());
        List<JobResult> scored = scoreJobsForUser(jobs, user);
        return JobSearchResponse.builder()
                .jobs(scored)
                .total(scored.size())
                .page(request.getPage())
                .query(query)
                .build();
    }

    public JobResult analyzeRedFlags(String email, String jobDescription) {
        ChatClient client = chatClientBuilder.build();
        String analysis = client.prompt()
                .system("""
                    You are an expert at analyzing job postings in the Philippines.
                    Analyze the job posting for red flags that fresh graduates should watch out for.
                    
                    Common red flags in PH job market:
                    - No salary disclosed (violates RA 11313)
                    - Requires payment for training or placement fees (illegal)
                    - Vague job description with no clear responsibilities
                    - Pyramid scheme indicators
                    - Unrealistic salary promises for entry-level
                    - No company name or unclear company identity
                    - Requires personal documents before job offer
                    
                    Respond in JSON format:
                    {
                        "hasRedFlags": true/false,
                        "redFlags": ["flag1", "flag2"],
                        "greenFlags": ["flag1", "flag2"],
                        "overallAssessment": "Safe/Proceed with caution/Avoid",
                        "summary": "brief summary in Taglish"
                    }
                    """)
                .user("Analyze this job posting:\n\n" + jobDescription)
                .call()
                .content();

        return JobResult.builder()
                .hasRedFlags(analysis.contains("\"hasRedFlags\": true"))
                .redFlagSummary(analysis)
                .build();
    }

    public String generateResume(String email, ResumeRequest request) {
        User user = getUser(email);
        ChatClient client = chatClientBuilder.build();

        return client.prompt()
                .system("""
                    You are an expert resume writer specializing in the Philippine job market.
                    Create an ATS-optimized resume for a Filipino fresh graduate.
                    
                    Guidelines:
                    - Use clean, professional format
                    - Include Philippine-relevant details (TOR, board rating if applicable)
                    - Highlight skills relevant to the target role
                    - Use action verbs
                    - Keep to 1 page for fresh graduates
                    - Include a strong summary paragraph
                    - Format as plain text with clear sections
                    
                    Sections to include:
                    1. Contact Information
                    2. Professional Summary
                    3. Education
                    4. Skills
                    5. Projects/Experience
                    6. Certifications (if any)
                    """)
                .user("Create a resume for:\n"
                        + "Name: " + user.getFullName() + "\n"
                        + "Email: " + user.getEmail() + "\n"
                        + "Course: " + user.getCourse() + "\n"
                        + "School: " + user.getSchool() + "\n"
                        + "Target role: " + request.getTargetRole() + "\n"
                        + "Target industry: " + request.getTargetIndustry() + "\n"
                        + "Skills: " + String.join(", ", request.getSkills()) + "\n"
                        + "Projects: " + String.join(", ", request.getProjects()) + "\n"
                )
                .call()
                .content();
    }

    public String generateCoverLetter(String email, String jobTitle,
                                      String company, String jobDescription) {
        User user = getUser(email);
        ChatClient client = chatClientBuilder.build();

        return client.prompt()
                .system("""
                    You are an expert cover letter writer for the Philippine job market.
                    Write a compelling, personalized cover letter for a Filipino fresh graduate.
                    
                    Guidelines:
                    - Professional but warm Filipino tone
                    - 3 paragraphs: intro, body (skills match), closing
                    - Reference specific details from the job posting
                    - Show enthusiasm and cultural fit
                    - End with a clear call to action
                    - Maximum 300 words
                    """)
                .user("Write a cover letter for:\n"
                        + "Applicant: " + user.getFullName() + "\n"
                        + "Course: " + user.getCourse() + "\n"
                        + "School: " + user.getSchool() + "\n"
                        + "Position: " + jobTitle + "\n"
                        + "Company: " + company + "\n"
                        + "Job description: " + jobDescription + "\n"
                )
                .call()
                .content();
    }

    private List<JobResult> fetchFromJSearch(String query, int page) {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://jsearch.p.rapidapi.com/search")
                    .queryParam("query", query)
                    .queryParam("page", page)
                    .queryParam("num_pages", "1")
                    .queryParam("country", "ph")
                    .queryParam("language", "en")
                    .build()
                    .toUriString()
                    .replace("%20", "+");

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", jsearchApiKey);
            headers.set("X-RapidAPI-Host", jsearchApiHost);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity,
                    new ParameterizedTypeReference<>() {}
            );

            return parseJSearchResponse(response.getBody());
        } catch (Exception e) {
            log.error("JSearch API error: {}", e.getMessage());
            return getMockJobs();
        }
    }

    @SuppressWarnings("unchecked")
    private List<JobResult> parseJSearchResponse(Map<String, Object> body) {
        List<JobResult> results = new ArrayList<>();
        if (body == null) return getMockJobs();

        List<Map<String, Object>> data = (List<Map<String, Object>>) body.get("data");
        if (data == null || data.isEmpty()) return getMockJobs();

        for (Map<String, Object> job : data) {
            try {
                results.add(JobResult.builder()
                        .id(String.valueOf(job.get("job_id")))
                        .title(String.valueOf(job.get("job_title")))
                        .company(String.valueOf(job.get("employer_name")))
                        .location(String.valueOf(job.get("job_city"))
                                + ", " + String.valueOf(job.get("job_country")))
                        .employmentType(String.valueOf(job.get("job_employment_type")))
                        .description(String.valueOf(job.get("job_description")))
                        .applyLink(String.valueOf(job.get("job_apply_link")))
                        .postedAt(String.valueOf(job.get("job_posted_at_datetime_utc")))
                        .salaryMin(job.get("job_min_salary") != null
                                ? String.valueOf(job.get("job_min_salary")) : null)
                        .salaryMax(job.get("job_max_salary") != null
                                ? String.valueOf(job.get("job_max_salary")) : null)
                        .build());
            } catch (Exception e) {
                log.warn("Error parsing job: {}", e.getMessage());
            }
        }
        return results.isEmpty() ? getMockJobs() : results;
    }

    private List<JobResult> scoreJobsForUser(List<JobResult> jobs, User user) {
        if (user.getCourse() == null) return jobs;
        ChatClient client = chatClientBuilder.build();

        return jobs.stream().map(job -> {
                    try {
                        String prompt = "Rate how well this job fits the candidate on a scale of 0-100.\n"
                                + "Candidate: " + user.getCourse() + " graduate from " + user.getSchool() + "\n"
                                + "Job: " + job.getTitle() + " at " + job.getCompany() + "\n"
                                + "Description: " + (job.getDescription() != null
                                ? job.getDescription().substring(0,
                                Math.min(500, job.getDescription().length()))
                                : "N/A") + "\n"
                                + "Respond with ONLY a number 0-100.";

                        String scoreStr = client.prompt()
                                .user(prompt)
                                .call()
                                .content()
                                .trim()
                                .replaceAll("[^0-9]", "");

                        int score = scoreStr.isEmpty() ? 50 : Integer.parseInt(scoreStr);
                        score = Math.min(100, Math.max(0, score));
                        job.setFitScore(score);
                    } catch (Exception e) {
                        job.setFitScore(50);
                    }
                    return job;
                }).sorted(Comparator.comparingInt(
                        j -> -Optional.ofNullable(j.getFitScore()).orElse(0)))
                .toList();
    }

    private String buildQuery(JobSearchRequest request, User user) {
        if (request.getQuery() != null && !request.getQuery().isBlank()) {
            return request.getQuery() + " Philippines";
        }

        String course = user.getCourse() != null ? user.getCourse().toLowerCase() : "";
        String location = user.getRegion() != null
                ? user.getRegion().replace("NCR (Metro Manila)", "Metro Manila")
                .replaceAll("Region [IVX]+ \\((.+)\\)", "$1")
                : "Metro Manila";

        if (course.contains("computer science") || course.contains("information technology")) {
            return "software developer engineer entry level " + location + " Philippines";
        } else if (course.contains("data")) {
            return "data analyst data engineer entry level Philippines";
        } else if (course.contains("nursing")) {
            return "registered nurse staff nurse entry level Philippines";
        } else if (course.contains("accountancy") || course.contains("accounting")) {
            return "junior accountant CPA bookkeeper entry level Philippines";
        } else if (course.contains("civil engineering")) {
            return "civil engineer site engineer entry level Philippines";
        } else if (course.contains("electrical engineering")) {
            return "electrical engineer entry level Philippines";
        } else if (course.contains("mechanical engineering")) {
            return "mechanical engineer entry level Philippines";
        } else if (course.contains("architecture")) {
            return "architect junior architect entry level Philippines";
        } else if (course.contains("business administration") || course.contains("management")) {
            return "business analyst operations associate entry level Philippines";
        } else if (course.contains("communication") || course.contains("journalism")) {
            return "content writer communications specialist entry level Philippines";
        } else if (course.contains("education")) {
            return "teacher educator entry level Philippines";
        } else if (course.contains("psychology")) {
            return "HR assistant recruitment associate entry level Philippines";
        } else if (course.contains("medicine") || course.contains("pharmacy")) {
            return "medical representative pharmacist entry level Philippines";
        } else {
            return "entry level fresh graduate " + location + " Philippines";
        }
    }

    private List<JobResult> getMockJobs() {
        return List.of(
                JobResult.builder()
                        .id("mock-1").title("Junior Software Developer")
                        .company("GCash").location("BGC, Taguig")
                        .employmentType("FULLTIME").fitScore(95)
                        .salaryMin("35000").salaryMax("45000")
                        .description("Join our engineering team as a junior developer.")
                        .applyLink("https://kalibrr.com").build(),
                JobResult.builder()
                        .id("mock-2").title("Software Engineer I")
                        .company("Shopee Philippines").location("Makati")
                        .employmentType("FULLTIME").fitScore(88)
                        .salaryMin("40000").salaryMax("55000")
                        .description("Build and maintain scalable backend services.")
                        .applyLink("https://jobstreet.com.ph").build(),
                JobResult.builder()
                        .id("mock-3").title("Associate Developer")
                        .company("UnionBank").location("Ortigas")
                        .employmentType("FULLTIME").fitScore(76)
                        .salaryMin("30000").salaryMax("40000")
                        .description("Work on digital banking solutions.")
                        .applyLink("https://linkedin.com").build()
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}