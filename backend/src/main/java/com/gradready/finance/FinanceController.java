package com.gradready.finance;

import com.gradready.rag.RagQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.gradready.user.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final RagQueryService ragQueryService;
    private final ChatClient.Builder chatClientBuilder;
    private final UserRepository userRepository;

    @GetMapping("/guide")
    public ResponseEntity<Map<String, Object>> getGuide(
            @AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        return ResponseEntity.ok(Map.of(
                "salary", getSalaryGuide(user.getCourse()),
                "topics", getFinanceTopics()
        ));
    }

    @PostMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculate(
            @RequestBody Map<String, Object> body) {
        double grossSalary = Double.parseDouble(body.get("grossSalary").toString());

        double sss = Math.min(grossSalary * 0.045, 1350);
        double philhealth = grossSalary * 0.025;
        double pagibig = Math.min(grossSalary * 0.02, 100);
        double annualIncome = grossSalary * 12;
        double withholdingTax = calculateWithholdingTax(annualIncome) / 12;
        double totalDeductions = sss + philhealth + pagibig + withholdingTax;
        double takeHome = grossSalary - totalDeductions;

        return ResponseEntity.ok(Map.of(
                "grossSalary", Math.round(grossSalary),
                "sss", Math.round(sss),
                "philhealth", Math.round(philhealth),
                "pagibig", Math.round(pagibig),
                "withholdingTax", Math.round(withholdingTax),
                "totalDeductions", Math.round(totalDeductions),
                "takeHome", Math.round(takeHome),
                "needs", Math.round(takeHome * 0.50),
                "wants", Math.round(takeHome * 0.30),
                "savings", Math.round(takeHome * 0.20)
        ));
    }

    private double calculateWithholdingTax(double annualIncome) {
        if (annualIncome <= 250000) return 0;
        if (annualIncome <= 400000) return (annualIncome - 250000) * 0.15;
        if (annualIncome <= 800000) return 22500 + (annualIncome - 400000) * 0.20;
        if (annualIncome <= 2000000) return 102500 + (annualIncome - 800000) * 0.25;
        if (annualIncome <= 8000000) return 402500 + (annualIncome - 2000000) * 0.30;
        return 2202500 + (annualIncome - 8000000) * 0.35;
    }

    private String getSalaryGuide(String course) {
        if (course == null) return "P18,000-P35,000";
        String c = course.toLowerCase();
        if (c.contains("computer") || c.contains("information technology"))
            return "P25,000-P45,000";
        if (c.contains("nursing")) return "P18,000-P30,000";
        if (c.contains("accountancy")) return "P18,000-P30,000";
        if (c.contains("engineering")) return "P20,000-P40,000";
        if (c.contains("architecture")) return "P18,000-P30,000";
        if (c.contains("medicine")) return "P25,000-P50,000";
        return "P18,000-P35,000";
    }

    private java.util.List<Map<String, String>> getFinanceTopics() {
        return java.util.List.of(
                Map.of("id", "payslip", "title", "Understanding your payslip",
                        "icon", "💰", "desc", "SSS, PhilHealth, Pag-IBIG, taxes explained"),
                Map.of("id", "budget", "title", "50/30/20 budgeting",
                        "icon", "📊", "desc", "How to budget your first salary"),
                Map.of("id", "banking", "title", "Banking guide",
                        "icon", "🏦", "desc", "GCash, Maya, BPI, BDO — which is best?"),
                Map.of("id", "invest", "title", "Start investing",
                        "icon", "📈", "desc", "MP2, UITF, stocks for beginners"),
                Map.of("id", "tax", "title", "Tax filing 101",
                        "icon", "📋", "desc", "When and how to file your ITR"),
                Map.of("id", "emergency", "title", "Emergency fund",
                        "icon", "🛡️", "desc", "How to build your financial safety net")
        );
    }
}