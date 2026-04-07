package com.gradready.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SalaryRepository extends JpaRepository<SalarySubmission, UUID> {

    List<SalarySubmission> findAllByOrderByCreatedAtDesc();

    @Query("SELECT AVG(s.monthlySalary) FROM SalarySubmission s WHERE LOWER(s.industry) = LOWER(:industry)")
    Double avgByIndustry(String industry);

    @Query("""
        SELECT s.company as company, AVG(s.monthlySalary) as avg,
               MIN(s.monthlySalary) as min, MAX(s.monthlySalary) as max,
               COUNT(s) as count
        FROM SalarySubmission s
        WHERE LOWER(s.industry) = LOWER(:industry)
        GROUP BY s.company
        ORDER BY avg DESC
        """)
    List<Map<String, Object>> statsByIndustry(String industry);
}