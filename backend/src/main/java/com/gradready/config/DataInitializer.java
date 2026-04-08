package com.gradready.config;

import com.gradready.rag.RagIngestionService;
import com.gradready.salary.SalaryRepository;
import com.gradready.salary.SalarySubmission;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RagIngestionService ragIngestionService;
    private final VectorStore vectorStore;
    private final SalaryRepository salaryRepository;

    @Override
    public void run(ApplicationArguments args) {
        try {
            SearchRequest request = SearchRequest.builder()
                    .query("TIN registration Philippines")
                    .topK(1)
                    .build();

            var existing = vectorStore.similaritySearch(request);

            if (existing.isEmpty()) {
                log.info("Vector store empty — running initial RAG ingestion...");
                ragIngestionService.ingestAllDocuments();
            } else {
                log.info("Vector store already populated — skipping ingestion.");
            }

            seedSalaryData();
            //seedCompanyReviews();
        } catch (Exception e) {
            log.warn("Could not check vector store on startup: {}", e.getMessage());
        }
    }

    private void seedSalaryData() {
        if (salaryRepository.count() > 0) return;
        log.info("Seeding salary data...");

        List<SalarySubmission> seeds = List.of(
                // IT / Tech
                seed("Software Engineer", "GCash", "Technology", 45000, 1, "NCR (Metro Manila)", "Hybrid"),
                seed("Junior Developer", "GCash", "Technology", 38000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Software Engineer I", "Shopee Philippines", "Technology", 50000, 1, "NCR (Metro Manila)", "WFH"),
                seed("Backend Developer", "Shopee Philippines", "Technology", 55000, 2, "NCR (Metro Manila)", "WFH"),
                seed("Associate Software Engineer", "UnionBank", "Banking", 38000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Junior Developer", "UnionBank", "Banking", 35000, 1, "NCR (Metro Manila)", "Onsite"),
                seed("Software Engineer", "Accenture Philippines", "IT Services", 32000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Technology Analyst", "Accenture Philippines", "IT Services", 28000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Junior Software Engineer", "Globe Telecom", "Telecommunications", 35000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("IT Associate", "PLDT", "Telecommunications", 28000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Data Analyst", "Grab Philippines", "Technology", 40000, 1, "NCR (Metro Manila)", "Hybrid"),
                seed("Frontend Developer", "Kalibrr", "Technology", 35000, 0, "NCR (Metro Manila)", "WFH"),
                seed("Software Engineer", "Maya (PayMaya)", "Fintech", 45000, 1, "NCR (Metro Manila)", "Hybrid"),
                seed("Junior Engineer", "Lazada Philippines", "E-commerce", 38000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Software Developer", "ING Philippines", "Banking", 55000, 1, "NCR (Metro Manila)", "Hybrid"),

                // BPO
                seed("Customer Service Rep", "Concentrix", "BPO", 20000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Technical Support", "Teleperformance", "BPO", 22000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Customer Service Rep", "TTEC Philippines", "BPO", 19000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Team Leader", "Concentrix", "BPO", 35000, 2, "NCR (Metro Manila)", "Onsite"),
                seed("Quality Analyst", "Teleperformance", "BPO", 28000, 1, "NCR (Metro Manila)", "Onsite"),

                // Nursing / Healthcare
                seed("Staff Nurse", "St. Luke's Medical Center", "Healthcare", 25000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Staff Nurse", "Makati Medical Center", "Healthcare", 23000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Staff Nurse", "The Medical City", "Healthcare", 22000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Nurse", "Philippine General Hospital", "Healthcare", 18000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Staff Nurse", "Asian Hospital", "Healthcare", 26000, 1, "NCR (Metro Manila)", "Onsite"),
                seed("Medical Representative", "Abbott Philippines", "Pharmaceutical", 28000, 0, "NCR (Metro Manila)", "Field"),
                seed("Medical Representative", "Unilab", "Pharmaceutical", 25000, 0, "NCR (Metro Manila)", "Field"),

                // Accounting / Finance
                seed("Junior Accountant", "SGV and Co (EY)", "Audit", 23000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Audit Associate", "Deloitte Philippines", "Audit", 24000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Junior Auditor", "KPMG Philippines", "Audit", 22000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Accounting Analyst", "Jollibee Foods Corp", "Food and Beverage", 22000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Finance Associate", "SM Investments", "Retail", 20000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Accounting Staff", "Ayala Corporation", "Conglomerate", 23000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Junior Accountant", "BDO Unibank", "Banking", 20000, 0, "NCR (Metro Manila)", "Onsite"),

                // Engineering
                seed("Junior Civil Engineer", "DMCI Holdings", "Construction", 22000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Site Engineer", "Megaworld Corporation", "Real Estate", 23000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Electrical Engineer", "Meralco", "Energy", 28000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Process Engineer", "San Miguel Corporation", "Manufacturing", 25000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("QA Engineer", "Texas Instruments PH", "Semiconductor", 32000, 0, "NCR (Metro Manila)", "Onsite"),
                seed("Manufacturing Engineer", "Intel Philippines", "Semiconductor", 35000, 0, "NCR (Metro Manila)", "Onsite"),

                // Marketing / Business
                seed("Marketing Associate", "Unilever Philippines", "FMCG", 22000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Brand Associate", "Nestle Philippines", "FMCG", 23000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Sales Associate", "Procter and Gamble PH", "FMCG", 25000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("HR Associate", "Accenture Philippines", "IT Services", 22000, 0, "NCR (Metro Manila)", "Hybrid"),
                seed("Operations Associate", "GrabFood", "Technology", 25000, 0, "NCR (Metro Manila)", "Hybrid"),

                // Visayas / Mindanao
                seed("Software Developer", "Cebu Pacific", "Aviation", 28000, 0, "Region VII (Central Visayas)", "Onsite"),
                seed("IT Support", "SM Cebu", "Retail", 18000, 0, "Region VII (Central Visayas)", "Onsite"),
                seed("Accountant", "Aboitiz Equity Ventures", "Conglomerate", 20000, 0, "Region VII (Central Visayas)", "Onsite"),
                seed("Nurse", "Chong Hua Hospital", "Healthcare", 18000, 0, "Region VII (Central Visayas)", "Onsite"),
                seed("Software Engineer", "Exist Software Labs", "Technology", 32000, 0, "Region VII (Central Visayas)", "Hybrid")
        );

        salaryRepository.saveAll(seeds);
        log.info("Seeded {} salary records.", seeds.size());
    }

    private SalarySubmission seed(String title, String company, String industry,
                                  int salary, int exp, String region, String setup) {
        return SalarySubmission.builder()
                .jobTitle(title).company(company).industry(industry)
                .monthlySalary(salary).yearsExp(exp).region(region)
                .workSetup(setup).isAnonymous(true).build();
    }
}