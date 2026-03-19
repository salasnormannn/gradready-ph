ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS school VARCHAR(255);

CREATE TABLE IF NOT EXISTS roadmap_items (
                                             id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    category      VARCHAR(100),
    week_number   INTEGER,
    is_completed  BOOLEAN DEFAULT FALSE,
    completed_at  TIMESTAMP,
    created_at    TIMESTAMP DEFAULT NOW()
    );

CREATE INDEX IF NOT EXISTS idx_roadmap_user_id ON roadmap_items(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_week ON roadmap_items(user_id, week_number);