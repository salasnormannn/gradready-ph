package com.gradready.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, String> {
    List<Conversation> findByUserEmailOrderByUpdatedAtDesc(String email);
    Optional<Conversation> findByIdAndUserEmail(String id, String email);
}
