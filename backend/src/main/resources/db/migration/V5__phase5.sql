-- Job Application Tracker
CREATE TABLE IF NOT EXISTS job_applications (
                                                id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company         VARCHAR(100) NOT NULL,
    role            VARCHAR(100) NOT NULL,
    job_url         TEXT,
    salary_min      INTEGER,
    salary_max      INTEGER,
    location        VARCHAR(100),
    work_setup      VARCHAR(50),
    status          VARCHAR(30) DEFAULT 'applied',
    applied_date    DATE DEFAULT CURRENT_DATE,
    interview_date  TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
    );

-- Salary submissions
CREATE TABLE IF NOT EXISTS salary_submissions (
                                                  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    job_title       VARCHAR(100) NOT NULL,
    company         VARCHAR(100) NOT NULL,
    industry        VARCHAR(100) NOT NULL,
    monthly_salary  INTEGER NOT NULL,
    years_exp       INTEGER DEFAULT 0,
    region          VARCHAR(100),
    course          VARCHAR(100),
    work_setup      VARCHAR(50),
    is_anonymous    BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT NOW()
    );

-- Company reviews
CREATE TABLE IF NOT EXISTS company_reviews (
                                               id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    company             VARCHAR(100) NOT NULL,
    industry            VARCHAR(100) NOT NULL,
    role                VARCHAR(100),
    rating_overall      INTEGER CHECK (rating_overall BETWEEN 1 AND 5),
    rating_salary       INTEGER CHECK (rating_salary BETWEEN 1 AND 5),
    rating_wlb          INTEGER CHECK (rating_wlb BETWEEN 1 AND 5),
    rating_growth       INTEGER CHECK (rating_growth BETWEEN 1 AND 5),
    rating_culture      INTEGER CHECK (rating_culture BETWEEN 1 AND 5),
    rating_hmo          INTEGER CHECK (rating_hmo BETWEEN 1 AND 5),
    pros                TEXT,
    cons                TEXT,
    advice              TEXT,
    is_anonymous        BOOLEAN DEFAULT true,
    is_fresh_grad       BOOLEAN DEFAULT true,
    created_at          TIMESTAMP DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_company ON salary_submissions(company);
CREATE INDEX IF NOT EXISTS idx_salary_submissions_industry ON salary_submissions(industry);
CREATE INDEX IF NOT EXISTS idx_company_reviews_company ON company_reviews(company);