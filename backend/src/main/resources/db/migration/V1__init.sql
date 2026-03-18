-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
                       id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email         VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       full_name     VARCHAR(255) NOT NULL,
                       course        VARCHAR(255),
                       graduation_year INTEGER,
                       region        VARCHAR(100),
                       school        VARCHAR(255),
                       is_verified   BOOLEAN DEFAULT FALSE,
                       created_at    TIMESTAMP DEFAULT NOW(),
                       updated_at    TIMESTAMP DEFAULT NOW()
);

-- Roadmap items table
CREATE TABLE roadmap_items (
                               id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
                               title        VARCHAR(255) NOT NULL,
                               description  TEXT,
                               category     VARCHAR(100),
                               week_number  INTEGER,
                               is_completed BOOLEAN DEFAULT FALSE,
                               completed_at TIMESTAMP,
                               created_at   TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens table (for JWT refresh)
CREATE TABLE refresh_tokens (
                                id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
                                token      VARCHAR(500) UNIQUE NOT NULL,
                                expires_at TIMESTAMP NOT NULL,
                                created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_roadmap_user_id ON roadmap_items(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
