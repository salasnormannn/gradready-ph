package com.gradready.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ConversationMessageRepository extends JpaRepository<ConversationMessage, Long> {
    List<ConversationMessage> findByConversationIdOrderByCreatedAtAsc(String conversationId);

    // Last 20 messages for AI context (newest first, then reversed in service)
    List<ConversationMessage> findTop20ByConversationIdOrderByCreatedAtDesc(String conversationId);

    @Transactional
    void deleteByConversationId(String conversationId);
}
