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
        docs.addAll(getFinancialLiteracyDocuments());
        docs.addAll(getBoardExamDocuments());
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

    private List<Document> getFinancialLiteracyDocuments() {
        return List.of(
                new Document("""
            Understanding Your First Payslip in the Philippines

            When you receive your first salary, these deductions will appear:

            SSS Contribution (2024):
            - Employee share: 4.5% of monthly salary credit
            - For P25,000 salary: P1,125/month deducted
            - Employer also pays 9.5% on your behalf

            PhilHealth Contribution (2024):
            - 5% of basic monthly salary total
            - Employee share: 2.5% (you pay half)
            - For P25,000 salary: P625/month deducted

            Pag-IBIG Contribution:
            - Employee share: 2% of salary, maximum P100/month
            - Most employees pay exactly P100/month

            Withholding Tax (TRAIN Law):
            - Annual income up to P250,000: ZERO tax (tax exempt)
            - P250,001 to P400,000: 15% on excess over P250,000
            - P400,001 to P800,000: P22,500 + 20% on excess over P400,000
            - Fresh grads earning P25,000/month (P300,000/year): pay small withholding tax

            Example take-home for P25,000 gross salary:
            - SSS: -P1,125
            - PhilHealth: -P625
            - Pag-IBIG: -P100
            - Withholding tax: approximately -P208/month
            - Take-home pay: approximately P22,942/month

            13th Month Pay:
            - Mandatory for all rank-and-file employees
            - Equal to 1/12 of total basic salary earned in a year
            - Tax-exempt up to P90,000
            - Must be paid on or before December 24

            Other common benefits:
            - Rice subsidy allowance: P2,000/month (tax-exempt)
            - Transportation allowance: often P1,500-P3,000/month
            - HMO coverage: company-paid health insurance
            """,
                        Map.of("source", "Finance", "topic", "payslip guide", "category", "finance")),

                new Document("""
            Budgeting Guide for Filipino Fresh Graduates

            The 50/30/20 Rule adapted for Philippines:

            50% — Needs (Essential expenses):
            - Rent: P5,000-P8,000 (boarding house/condo in Metro Manila)
            - Food: P3,000-P5,000/month (home cooking + occasional dining)
            - Transportation: P2,000-P3,000/month (commute)
            - Utilities: P500-P1,000/month (electric, water, internet share)
            - Total needs for P22,942 take-home: aim for P11,471

            30% — Wants (Discretionary):
            - Dining out, entertainment, subscriptions
            - Shopping, personal care
            - Aim for P6,882/month

            20% — Savings and Investments:
            - Emergency fund first: save P500-P2,000/month until 3-6 months expenses saved
            - Then invest: Pag-IBIG MP2 minimum P500/month
            - Target: P4,588/month saved/invested

            Banking recommendations for fresh graduates:
            Best for savings:
            - Maya Savings: 3.5% interest per year, no maintaining balance
            - GCash GSave: 5% interest per year (powered by CIMB Bank)
            - Tonik Bank: up to 6% interest per year

            Best traditional banks:
            - BPI: best mobile app, nationwide ATM
            - BDO: most branches, good for salary accounts
            - UnionBank: best digital features among traditional banks

            Emergency fund target: 3-6 months of expenses
            For P22,942 take-home, emergency fund target = P68,826-P137,652
            Start with P1,000/month if you can't save more yet
            """,
                        Map.of("source", "Finance", "topic", "budgeting guide", "category", "finance")),

                new Document("""
            Investment Guide for Filipino Fresh Graduates

            Start investing as early as possible — time in market beats timing the market.

            Beginner investments (start here):

            1. Pag-IBIG MP2 (Modified Pag-IBIG 2) — SAFEST
            - Government-backed, zero risk of losing principal
            - Average dividend: 6-7% per year (beats most banks)
            - Minimum: P500/month
            - Maturity: 5 years (can withdraw after)
            - How to open: pagibigfund.gov.ph → MP2 enrollment
            - Best for: emergency fund parking, conservative investors

            2. UITF (Unit Investment Trust Fund) — LOW RISK
            - Managed by banks (BPI, BDO, Metrobank)
            - Types: Money Market (safest), Bond Fund, Equity Fund (highest return/risk)
            - Minimum investment: P1,000 (BPI/BDO)
            - For fresh grads: start with Money Market UITF
            - Returns: 4-8% per year depending on fund type

            3. GInvest via GCash — BEGINNER FRIENDLY
            - Start with P50 minimum
            - Choose from mutual funds: ATRAM, BPI, Philam
            - Easy to monitor via GCash app
            - Good for: testing investing without big commitment

            4. COL Financial — STOCKS
            - Philippine Stock Exchange (PSE) access
            - Minimum account opening: P1,000
            - For beginners: start with index fund (COL Fund)
            - Only invest what you can leave for 5+ years
            - Risk: can go down short-term

            Investment priority for fresh grads:
            1. Build emergency fund first (3 months expenses in Maya/GCash)
            2. Start Pag-IBIG MP2 (P500/month minimum)
            3. Open UITF at your bank (P1,000 to start)
            4. After 6 months: explore stocks via COL Financial
            """,
                        Map.of("source", "Finance", "topic", "investment guide", "category", "finance")),

                new Document("""
            Income Tax Filing Guide for Fresh Graduates in the Philippines

            Who needs to file Income Tax Return (ITR):
            - Employees with ONLY ONE employer: employer files on your behalf (BIR Form 2316)
              You do NOT need to file your own ITR
            - Employees with TWO OR MORE employers in a year: must file ITR
            - Freelancers/self-employed: must file quarterly and annual ITR
            - Mixed income earners (employed + freelance): must file ITR

            BIR Forms to know:
            - Form 2316: Certificate of Compensation Payment (from employer)
            - Form 1700: Annual ITR for pure compensation income earners
            - Form 1701: Annual ITR for self-employed/mixed income
            - Form 1701Q: Quarterly ITR for self-employed

            ITR Filing Deadlines:
            - Annual ITR: April 15 every year (for previous year income)
            - Q1 (Jan-Mar): May 15
            - Q2 (Apr-Jun): August 15
            - Q3 (Jul-Sep): November 15

            How to file online (eBIRForms):
            1. Download eBIRForms from bir.gov.ph
            2. Fill out appropriate form (1700 or 1701)
            3. Submit electronically
            4. Pay any tax due via GCash, Maya, or authorized banks

            TRAIN Law Tax Exemption (good news for fresh grads):
            - Annual income of P250,000 and below: ZERO income tax
            - Fresh grad earning P20,000/month = P240,000/year = TAX EXEMPT!
            - Fresh grad earning P25,000/month = P300,000/year = pays small tax only
            """,
                        Map.of("source", "Finance", "topic", "ITR filing", "category", "finance"))
        );
    }

    private List<Document> getBoardExamDocuments() {
        return List.of(
                new Document("""
            PRC Licensure Examination Complete Guide

            The Professional Regulation Commission (PRC) administers all professional
            licensure exams in the Philippines.

            Exam Schedules (approximate — verify at prc.gov.ph):

            Nursing (NLE):
            - June and December each year
            - Covers: Fundamentals, Medical-Surgical, Community Health,
              Maternal & Child, Psychiatric Nursing
            - Passing rate: 50% and above

            CPA Board Exam (CPALE):
            - May and October each year
            - 6 subjects: FAR, AFAR, MAS, AT, Tax, RFBT
            - Must pass all 6 subjects with average of 75%, no subject below 65%

            Engineering Board Exams:
            - Civil Engineering: May and November
            - Electrical Engineering: April and September
            - Mechanical Engineering: May and November
            - Electronics Engineering: April and October
            - Chemical Engineering: April and October

            Architecture (ARE):
            - June and December each year

            Teachers (LET):
            - March and September each year
            - Elementary and Secondary levels separate

            How to register for PRC board exam:
            1. Create account at prc.gov.ph
            2. Click Register for Examination
            3. Select profession and exam schedule
            4. Upload requirements: TOR, birth certificate, good moral certificate, photos
            5. Pay examination fee (P900-P1,500 depending on profession)
            6. Print Notice of Admission (NOA)

            After passing the board exam:
            1. Check results at prc.gov.ph (2-5 days after exam)
            2. Register for Certificate of Registration
            3. Attend oath-taking ceremony
            4. Receive PRC Professional ID Card
            5. Renew PRC ID every 3 years (P450 renewal fee)
            """,
                        Map.of("source", "PRC", "topic", "board exam guide", "category", "board_exam")),

                new Document("""
            Board Exam Review Tips for Filipino Professionals

            General study strategies:
            - Start reviewing 3-6 months before the exam date
            - Create a weekly study schedule and stick to it
            - Focus on past board exam questions (available from PRC and review centers)
            - Join study groups with fellow examinees

            For Nursing (NLE):
            Top review centers: Kaplan, R.N. Heals, UERM Review Center
            Key topics: Prioritization questions, Maslow's hierarchy, ABC (Airway, Breathing, Circulation)
            Study tip: Focus on Medical-Surgical nursing (largest portion of the exam)
            Average cost of review: P8,000-P15,000

            For CPA (CPALE):
            Top review centers: Villanueva CPA Review, Manila Review Institute, Asian Institute of CPA
            Key topics: Financial Accounting is foundation — master it first
            Study tip: Do at least 1,000 practice problems per subject
            Average cost of review: P15,000-P30,000

            For Civil Engineering:
            Top review centers: Excel Review Center, MERIT Review Center
            Key topics: Math, Structural Analysis, Hydraulics, Geotechnical Engineering
            Study tip: Time management during exam is crucial — practice under timed conditions
            Average cost of review: P8,000-P15,000

            For LET (Teachers):
            Top review centers: PRTC, LET Review Manila
            Key topics: Professional Education subjects have highest weight
            Study tip: Focus on Child Development and Teaching Strategies

            CHED Scholarships for review center:
            - Some LGUs offer free review programs
            - Check with your school's alumni office for scholarship partnerships
            - CHED UniFAST program may cover review costs
            """,
                        Map.of("source", "PRC", "topic", "board exam review tips", "category", "board_exam"))
        );
    }
}