package com.gradready.rag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RagIngestionService {

    private final VectorStore vectorStore;

    public void ingestAllDocuments() {
        log.info("Starting RAG ingestion of PH gov documents...");
        List<Document> docs = new ArrayList<>();
        docs.addAll(getBirDocuments());
        docs.addAll(getSssDocuments());
        docs.addAll(getPhilHealthDocuments());
        docs.addAll(getPagIbigDocuments());
        docs.addAll(getNbiDocuments());
        docs.addAll(getPrcDocuments());
        docs.addAll(getPhilSysDocuments());
        docs.addAll(getGeneralFinanceDocuments());
        vectorStore.add(docs);
        log.info("RAG ingestion complete. Ingested {} documents.", docs.size());
    }

    private List<Document> getBirDocuments() {
        return List.of(
                new Document("""
                TIN Registration for New Employees (BIR Form 1902)
                
                Who needs to file: New employees in the Philippines who have never had a TIN before.
                
                Requirements:
                - BIR Form 1902 (Application for Registration for Individuals Earning Purely Compensation Income)
                - Birth Certificate (PSA copy)
                - Valid government-issued ID
                - Marriage certificate (if applicable)
                
                Steps to register:
                1. Get BIR Form 1902 from your employer's HR department or download from bir.gov.ph
                2. Fill out the form completely with your personal information
                3. Submit to the Revenue District Office (RDO) where your employer is registered
                4. Your employer typically processes this on your behalf
                5. Receive your TIN card within 2-3 weeks
                
                Important notes:
                - TIN is free — never pay anyone to get your TIN
                - One TIN per person for life — you cannot have two TINs
                - Self-employed individuals use BIR Form 1901 instead
                - Freelancers register as self-employed at the RDO where they reside
                
                For fresh graduates: Ask your first employer's HR to process your TIN registration.
                If you need TIN for job applications before employment, go to your nearest BIR RDO.
                """,
                        Map.of("source", "BIR", "topic", "TIN registration", "category", "government")),

                new Document("""
                BIR Annual Income Tax Return Filing (ITR) for Employees
                
                Who needs to file: Employees whose employers do not file on their behalf (mixed income earners).
                
                Most employees with a single employer do NOT need to file their own ITR — 
                their employer files for them via BIR Form 2316.
                
                When you DO need to file:
                - You have two or more employers in a year
                - You are a mixed income earner (employed + freelance)
                - Your employer did not withhold taxes
                
                Deadline: April 15 of every year for the previous tax year
                
                How to file online via eBIRForms:
                1. Download eBIRForms from bir.gov.ph
                2. Fill out BIR Form 1700 (for pure compensation) or 1701 (mixed income)
                3. Submit electronically through the eBIRForms system
                4. Pay any tax due through authorized banks or GCash/Maya
                
                Tax rates for employees (TRAIN Law):
                - Up to ₱250,000: 0% (tax exempt)
                - ₱250,001 to ₱400,000: 15% on excess over ₱250,000
                - ₱400,001 to ₱800,000: ₱22,500 + 20% on excess over ₱400,000
                - ₱800,001 to ₱2,000,000: ₱102,500 + 25% on excess over ₱800,000
                """,
                        Map.of("source", "BIR", "topic", "ITR filing", "category", "government"))
        );
    }

    private List<Document> getSssDocuments() {
        return List.of(
                new Document("""
                SSS Registration for First-Time Members
                
                Who needs to register: All employed individuals, self-employed, and OFWs in the Philippines.
                
                Online Registration via My.SSS (Recommended):
                1. Go to my.sss.gov.ph
                2. Click "Not yet registered in My.SSS?"
                3. Select member type: Employed, Self-Employed, or Voluntary
                4. Fill in your personal details
                5. Upload a valid government ID
                6. Wait for your SS Number via email (usually 1-3 business days)
                
                Walk-in Registration:
                1. Go to any SSS branch with a valid ID
                2. Fill out SSS Form E-1 (Personal Record)
                3. Submit form and ID
                4. Receive SS Number on the same day
                
                Required documents:
                - Any primary ID (passport, driver's license, UMID, PRC ID)
                - Or two secondary IDs (school ID + birth certificate)
                
                SSS Benefits for members:
                - Sickness benefit: 90% of average daily salary credit
                - Maternity benefit: up to 105 days paid leave
                - Disability benefit: monthly pension
                - Retirement benefit: monthly pension at age 65
                - Death and funeral benefit for dependents
                - Salary loan: up to 2 months salary credit
                
                SSS Contribution rates (2024):
                - Employee share: 4.5% of monthly salary credit
                - Employer share: 9.5% of monthly salary credit
                - Total: 14% — employer deducts from salary and remits to SSS
                """,
                        Map.of("source", "SSS", "topic", "SSS registration", "category", "government")),

                new Document("""
                SSS Contribution Table and Payment Schedule
                
                Monthly Salary Credit (MSC) ranges from ₱4,000 to ₱30,000.
                
                For fresh graduates with salary of ₱20,000:
                - MSC: ₱20,000
                - Employee contribution: ₱900/month (4.5%)
                - Employer contribution: ₱1,900/month (9.5%)
                
                For fresh graduates with salary of ₱25,000:
                - MSC: ₱25,000
                - Employee contribution: ₱1,125/month
                - Employer contribution: ₱2,375/month
                
                Payment deadlines (for self-employed/voluntary):
                - Monthly: last day of the month following the applicable month
                - Quarterly: last day of the month following the quarter
                
                Where to pay:
                - SSS branches
                - Bayad Center
                - 7-Eleven (via CLiQQ app)
                - GCash (SSS payment option)
                - Maya
                - BancNet partner banks
                
                How to check contributions online:
                1. Log in to My.SSS portal
                2. Click "Inquiry" then "Contributions"
                3. View your contribution history and balance
                """,
                        Map.of("source", "SSS", "topic", "SSS contributions", "category", "government"))
        );
    }

    private List<Document> getPhilHealthDocuments() {
        return List.of(
                new Document("""
                PhilHealth Registration for Fresh Graduates
                
                PhilHealth (Philippine Health Insurance Corporation) provides health insurance to all Filipinos.
                
                How to register as a new employee:
                1. Your employer will register you upon hiring
                2. Fill out PhilHealth Membership Registration Form (PMRF)
                3. Submit to HR or directly to PhilHealth office
                4. Receive PhilHealth ID Number (PIN)
                
                How to register if not yet employed (self-paying):
                1. Go to any PhilHealth office or Local Health Insurance Office (LHIO)
                2. Fill out PMRF form
                3. Choose membership type: Employed, Self-Employed, Indigent, or Senior Citizen
                4. Present valid government ID
                5. Pay your first premium contribution
                
                Online registration:
                1. Visit philhealth.gov.ph
                2. Click "Online Services" → "Member Registration"
                3. Fill out the online PMRF
                4. Submit and wait for PIN via email
                
                PhilHealth Contribution rates (2024):
                - 5% of monthly basic salary
                - Employee share: 2.5%
                - Employer share: 2.5%
                - Minimum monthly contribution: ₱500 (for salary below ₱10,000)
                - Maximum monthly contribution: ₱5,000 (for salary ₱100,000 and above)
                
                For fresh graduate earning ₱25,000:
                - Total contribution: ₱1,250/month
                - Your share: ₱625 (deducted from salary)
                - Employer share: ₱625
                
                PhilHealth Benefits:
                - Inpatient hospital care (room and board, drugs, lab tests)
                - Outpatient care
                - Z Benefits for catastrophic illnesses (cancer, dialysis)
                - Maternity care package
                - Mental health benefit
                """,
                        Map.of("source", "PhilHealth", "topic", "PhilHealth registration", "category", "government"))
        );
    }

    private List<Document> getPagIbigDocuments() {
        return List.of(
                new Document("""
                Pag-IBIG Fund (HDMF) Registration for Fresh Graduates
                
                Pag-IBIG provides housing loans, calamity loans, and multi-purpose loans to members.
                
                Mandatory coverage: All employees in the Philippines are required to be Pag-IBIG members.
                
                How to register:
                1. Visit pagibigfund.gov.ph
                2. Click "Membership" → "Online Membership Registration"
                3. Fill out the Membership Registration Form (MRF-1)
                4. Submit and receive your Pag-IBIG MID Number
                
                Walk-in registration:
                1. Go to any Pag-IBIG branch
                2. Fill out MRF-1 form
                3. Present valid government ID
                4. Receive MID Number on same day
                
                Contribution rates (2024):
                - Employees earning up to ₱1,500/month: 1% employee + 2% employer
                - Employees earning above ₱1,500/month: 2% employee + 2% employer
                - Maximum monthly contribution: ₱100 employee + ₱100 employer = ₱200 total
                - Optional higher savings available (TAV Program)
                
                Pag-IBIG MP2 (Modified Pag-IBIG 2) — Highly Recommended for Fresh Grads:
                - Voluntary savings program on top of mandatory contribution
                - Minimum monthly savings: ₱500
                - Average dividend rate: 6-7% per year (higher than most bank savings)
                - Tax-free dividends
                - Maturity: 5 years (can be renewed)
                
                Housing Loan Eligibility:
                - Must have at least 24 monthly contributions
                - Maximum loan: up to ₱6,000,000
                - Interest rates: 6.375% for ₱450,000 and below (30-year term)
                
                Multi-Purpose Loan:
                - Available after 24 monthly contributions
                - Can borrow up to 80% of total accumulated value
                """,
                        Map.of("source", "Pag-IBIG", "topic", "Pag-IBIG registration", "category", "government"))
        );
    }

    private List<Document> getNbiDocuments() {
        return List.of(
                new Document("""
                NBI Clearance Application Guide for Fresh Graduates
                
                NBI Clearance is required for most job applications in the Philippines.
                
                Online Application (Recommended):
                1. Go to clearance.nbi.gov.ph
                2. Register for an account with your email
                3. Fill in personal information
                4. Choose NBI branch and appointment date
                5. Pay the fee online (₱130 + e-clearance fee of ₱25 = ₱155 total)
                   OR choose to pay at payment centers (7-Eleven, Bayad Center, etc.)
                6. Print your application form and payment receipt
                7. Go to NBI office on your appointment date
                
                What to bring on appointment day:
                - Printed application form with QR code
                - Official receipt of payment
                - 1 valid government-issued ID with photo and signature
                  (Passport, Driver's License, UMID, Voter's ID, PRC ID, PhilSys ID)
                - For students/fresh grads without other IDs: School ID + birth certificate
                
                Processing time:
                - Without hit (no record): Same day release, usually 30-60 minutes
                - With hit (for verification): 7-10 business days
                
                NBI Clearance validity: 1 year from date of issue
                
                Tips for fresh graduates:
                - Book appointment early — slots fill up fast, especially in Metro Manila
                - NBI Megamall and SM branches are generally faster
                - Bring an extra ID just in case
                - Arrive 15-30 minutes before your appointment
                - NBI clearance fee is ₱130 for regular, plus processing fees
                
                Common reasons for "hit" (delay):
                - Same name as someone with a criminal record
                - You'll need to come back with supporting documents
                - Bring your birth certificate to differentiate yourself
                """,
                        Map.of("source", "NBI", "topic", "NBI clearance", "category", "government"))
        );
    }

    private List<Document> getPrcDocuments() {
        return List.of(
                new Document("""
                PRC Licensure Examination Registration Guide
                
                The Professional Regulation Commission (PRC) administers licensure exams for professionals in the Philippines.
                
                Professions with licensure exams include:
                Nursing, Engineering (Civil, Electrical, Mechanical, Chemical, Electronics),
                Accountancy (CPA), Architecture, Medicine, Dentistry, Pharmacy,
                Physical Therapy, Criminology, Teachers (LET), Psychology, and more.
                
                How to register for board exam:
                1. Create PRC online account at prc.gov.ph
                2. Click "Register for Examination"
                3. Select your profession and exam schedule
                4. Fill out the online application form
                5. Upload required documents:
                   - Transcript of Records (TOR) — certified true copy
                   - NSO/PSA Birth Certificate
                   - Certificate of Good Moral Character from school
                   - Recent 2x2 photos with white background
                   - Marriage Certificate (if applicable)
                6. Pay examination fee (varies by profession, usually ₱900-₱1,500)
                7. Print your Notice of Admission (NOA)
                
                Exam schedules:
                - Engineering boards: Usually March and September
                - Nursing: June and December
                - CPA: May and October
                - LET (Teachers): March and September
                - Check prc.gov.ph for exact dates each year
                
                After passing the board exam:
                1. Check results at prc.gov.ph (released 2-5 days after exam)
                2. Register for your PRC ID and Certificate of Registration
                3. Take your oath-taking ceremony
                4. Receive your PRC Professional ID Card
                
                PRC ID renewal: Every 3 years, pay ₱450 renewal fee online
                """,
                        Map.of("source", "PRC", "topic", "PRC board exam", "category", "government"))
        );
    }

    private List<Document> getPhilSysDocuments() {
        return List.of(
                new Document("""
                Philippine National ID (PhilSys) Registration Guide
                
                The Philippine Identification System (PhilSys) provides a single national ID for all Filipinos.
                
                How to register:
                Step 1 — Online pre-registration:
                1. Go to philsys.gov.ph or download the PhilSys app
                2. Fill out your personal information online
                3. Choose your preferred registration center and schedule
                
                Step 2 — On-site registration:
                1. Go to your scheduled PhilSys registration center
                   (Usually in PSA offices, malls, barangay halls, or schools)
                2. Bring required documents (see below)
                3. Have your biometrics captured: fingerprints, iris scan, photo
                4. Sign the registration form
                
                Required documents for fresh graduates:
                Primary documents (any one):
                - PSA Birth Certificate + any secondary ID
                - Passport
                - Driver's License
                - UMID
                - PRC ID
                
                Secondary documents (if no primary):
                - School ID + Form 137 or diploma
                - Barangay Certificate + Voter's ID
                
                After registration:
                - Receive a transaction slip with your PhilSys Number (PSN)
                - Physical card delivery: 2-6 months via PhilPost
                - Can use the transaction slip as temporary ID in the meantime
                
                PhilSys ID benefits:
                - Accepted as valid ID for all government transactions
                - Required for opening bank accounts (no other ID needed)
                - Reduces need to carry multiple IDs
                - Free for all Filipino citizens
                """,
                        Map.of("source", "PhilSys", "topic", "National ID registration", "category", "government"))
        );
    }

    private List<Document> getGeneralFinanceDocuments() {
        return List.of(
                new Document("""
                First Salary Guide for Filipino Fresh Graduates
                
                Understanding your first payslip deductions:
                
                For a fresh graduate earning ₱25,000/month:
                
                Mandatory deductions:
                - SSS: ₱1,125 (employee share, 4.5% of salary)
                - PhilHealth: ₱625 (employee share, 2.5% of salary)
                - Pag-IBIG: ₱100 (employee share, 2% capped at ₱100)
                - Withholding tax: ₱0 (below ₱250,000/year threshold = tax exempt)
                
                Total deductions: ₱1,850
                Take-home pay: ₱23,150
                
                For a salary of ₱35,000/month:
                - SSS: ₱1,575
                - PhilHealth: ₱875
                - Pag-IBIG: ₱100
                - Withholding tax: ~₱875/month
                - Take-home pay: approximately ₱31,575
                
                13th month pay:
                - Mandatory for all employees
                - Equal to 1/12 of your total basic salary earned in a year
                - Must be paid by December 24 each year
                - Tax exempt up to ₱90,000
                
                Budgeting guide for fresh graduates (50/30/20 rule):
                - 50% Needs: rent, food, transportation, utilities
                - 30% Wants: entertainment, dining out, shopping
                - 20% Savings/investments: emergency fund, MP2, UITF
                
                For ₱23,150 take-home:
                - Needs (50%): ₱11,575
                - Wants (30%): ₱6,945
                - Savings (20%): ₱4,630
                
                Banking recommendations for fresh graduates:
                - Traditional: BPI or BDO (nationwide branches, trusted)
                - Digital: GCash GSave (5% interest) or Maya Savings (3.5% interest)
                - No maintaining balance, no fees, higher interest than traditional banks
                
                Investment starter for fresh grads:
                - Pag-IBIG MP2: 6-7% annual dividend, minimum ₱500/month, safest option
                - UITF (Unit Investment Trust Fund): Start at ₱1,000, available at BPI/BDO
                - GInvest via GCash: Mutual funds starting at ₱50
                - COL Financial: Stock trading, minimum ₱1,000 initial deposit
                """,
                        Map.of("source", "Finance", "topic", "first salary guide", "category", "finance")),

                new Document("""
                Job Application Guide for Filipino Fresh Graduates
                
                Top job sites for fresh graduates in the Philippines:
                - Kalibrr (kalibrr.com) — best for fresh grads, many entry-level roles
                - JobStreet (jobstreet.com.ph) — largest job board in PH
                - LinkedIn — for professional networking and corporate jobs
                - Indeed Philippines — aggregate site, good for volume
                - OnlineJobs.ph — for remote/freelance work
                - BossJob — mobile-first, many BPO and entry-level roles
                
                Documents needed for job applications in the Philippines:
                - Updated resume (1-2 pages)
                - NBI Clearance (valid within 6 months)
                - Transcript of Records (TOR) — certified true copy
                - Diploma — certified true copy
                - Birth Certificate (PSA copy)
                - 2x2 photos (white background, business attire)
                - SSS, TIN, PhilHealth, Pag-IBIG numbers
                - Barangay Clearance (some companies require this)
                - Medical Certificate from licensed physician
                
                Salary negotiation tips for fresh graduates:
                - Research industry standard: ₱18,000-₱35,000 for entry-level IT
                - ₱15,000-₱25,000 for business/admin roles in NCR
                - ₱20,000-₱35,000 for engineering roles
                - Always give a range, not a fixed number
                - Factor in benefits: HMO, rice allowance, transportation
                - Don't be afraid to negotiate — 80% of employers expect it
                
                Red flags in job postings:
                - No salary range disclosed (legal requirement in PH per RA 11313)
                - Asking for placement fees or training fees
                - Vague job description with no company name
                - Requires you to pay for your own background check
                - Promises unrealistic salary for entry-level role
                """,
                        Map.of("source", "Career", "topic", "job application guide", "category", "career"))
        );
    }
}