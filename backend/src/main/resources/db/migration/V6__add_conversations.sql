-- Chat conversations
CREATE TABLE IF NOT EXISTS conversations (
    id          VARCHAR(36) PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(120) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Messages within each conversation
CREATE TABLE IF NOT EXISTS conversation_messages (
    id                  BIGSERIAL PRIMARY KEY,
    conversation_id     VARCHAR(36) NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role                VARCHAR(20) NOT NULL,   -- 'user' or 'assistant'
    content             TEXT NOT NULL,
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user    ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conv_messages_conv    ON conversation_messages(conversation_id);
