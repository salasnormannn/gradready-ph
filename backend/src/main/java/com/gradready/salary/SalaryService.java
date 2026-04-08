package com.gradready.salary;

import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryRepository repository;
    private final UserRepository userRepository;

    public SalarySubmission submit(String email, SalaryRequest req) {
        User user = getUser(email);
        SalarySubmission sub = SalarySubmission.builder()
                .user(user)
                .jobTitle(req.getJobTitle())
                .company(req.getCompany())
                .industry(req.getIndustry())
                .monthlySalary(req.getMonthlySalary())
                .yearsExp(req.getYearsExp())
                .region(req.getRegion())
                .course(req.getCourse())
                .workSetup(req.getWorkSetup())
                .isAnonymous(req.getIsAnonymous() != null ? req.getIsAnonymous() : true)
                .build();
        return repository.save(sub);
    }

    public List<SalaryResponse> search(String company, String industry, String jobTitle) {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(s -> company == null || company.isBlank() ||
                        s.getCompany().toLowerCase().contains(company.toLowerCase()))
                .filter(s -> industry == null || industry.isBlank() ||
                        s.getIndustry().toLowerCase().contains(industry.toLowerCase()))
                .filter(s -> jobTitle == null || jobTitle.isBlank() ||
                        s.getJobTitle().toLowerCase().contains(jobTitle.toLowerCase()))
                .map(SalaryResponse::from)
                .toList();
    }

    public Map<String, Object> getStats(String industry) {
        List<Map<String, Object>> byCompany = repository.statsByIndustry(industry);
        Double avg = repository.avgByIndustry(industry);
        return Map.of(
                "industry", industry,
                "averageSalary", avg != null ? Math.round(avg) : 0,
                "byCompany", byCompany
        );
    }

    public List<String> getIndustries() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(SalarySubmission::getIndustry)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}