package com.gradready.chat;

import com.gradready.rag.RagQueryService;
import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder chatClientBuilder;
    private final RagQueryService ragQueryService;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMessageRepository conversationMessageRepository;

    // ── Send a message ─────────────────────────────────────────────────────────

    @Transactional
    public ChatResponse chat(String email, ChatRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Resolve or create conversation
        Conversation conversation;
        List<ConversationMessage> history = new ArrayList<>();

        if (request.getConversationId() != null) {
            conversation = conversationRepository
                    .findByIdAndUserEmail(request.getConversationId(), email)
                    .orElseGet(() -> createConversation(user, request.getMessage()));
            // Last 20 messages in chronological order for context
            List<ConversationMessage> recent = conversationMessageRepository
                    .findTop20ByConversationIdOrderByCreatedAtDesc(conversation.getId());
            Collections.reverse(recent);
            history = recent;
        } else {
            conversation = createConversation(user, request.getMessage());
        }

        // Persist user message
        conversationMessageRepository.save(ConversationMessage.builder()
                .conversation(conversation)
                .role("user")
                .content(request.getMessage())
                .build());

        // Build prompt with RAG context + history
        String context = ragQueryService.getRelevantContext(request.getMessage());
        String systemPrompt = buildSystemPrompt(user, context, history);

        String userMessage = request.getMessage().toLowerCase();
        boolean isLongGeneration = userMessage.contains("cover letter")
                || userMessage.contains("resume")
                || userMessage.contains("red flag")
                || userMessage.contains("write")
                || userMessage.contains("generate");
        String model = isLongGeneration ? "gpt-4o-mini" : "gpt-4o";

        String response = chatClientBuilder
                .defaultOptions(
                        org.springframework.ai.openai.OpenAiChatOptions.builder()
                                .model(model)
                                .temperature(0.7)
                                .maxTokens(800)
                                .build())
                .build()
                .prompt()
                .system(systemPrompt)
                .user(request.getMessage())
                .call()
                .content();

        // Persist assistant message
        conversationMessageRepository.save(ConversationMessage.builder()
                .conversation(conversation)
                .role("assistant")
                .content(response)
                .build());

        // Touch updatedAt so sidebar ordering stays fresh
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return ChatResponse.builder()
                .message(response)
                .conversationId(conversation.getId())
                .source(context.isEmpty() ? "general" : "rag")
                .build();
    }

    // ── Conversation CRUD ──────────────────────────────────────────────────────

    public List<ConversationSummaryDTO> getConversations(String email) {
        return conversationRepository.findByUserEmailOrderByUpdatedAtDesc(email)
                .stream()
                .map(c -> new ConversationSummaryDTO(c.getId(), c.getTitle(), c.getCreatedAt(), c.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    public ConversationDetailDTO getConversation(String email, String id) {
        Conversation conv = conversationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        List<ConversationDetailDTO.MessageDTO> messages = conversationMessageRepository
                .findByConversationIdOrderByCreatedAtAsc(id)
                .stream()
                .map(m -> new ConversationDetailDTO.MessageDTO(m.getRole(), m.getContent(), m.getCreatedAt()))
                .collect(Collectors.toList());

        return new ConversationDetailDTO(conv.getId(), conv.getTitle(), messages);
    }

    @Transactional
    public void deleteConversation(String email, String id) {
        Conversation conv = conversationRepository.findByIdAndUserEmail(id, email)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        conversationMessageRepository.deleteByConversationId(id);
        conversationRepository.delete(conv);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private Conversation createConversation(User user, String firstMessage) {
        String title = firstMessage.length() > 80
                ? firstMessage.substring(0, 77) + "..."
                : firstMessage;
        Conversation conv = Conversation.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .title(title)
                .updatedAt(LocalDateTime.now())
                .build();
        return conversationRepository.save(conv);
    }

    private String buildSystemPrompt(User user, String context, List<ConversationMessage> history) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            Ikaw si Kuya AI — ang AI assistant ng GradReady PH.

            Your personality:
            - You are like a friendly older brother (kuya) who has been through all the post-grad challenges
            - You speak in a natural mix of Filipino and English (Taglish) — warm, casual, encouraging
            - You are knowledgeable about Philippine government processes, job hunting, and finance
            - You give practical, actionable advice specific to the Philippines
            - You are never condescending — always supportive and understanding
            - Keep responses concise but helpful — max 3-4 paragraphs
            - Use "ka", "mo", "ko", "tayo" naturally in sentences
            - End with encouragement when appropriate

            """);

        prompt.append("User profile:\n");
        prompt.append("- Name: ").append(user.getFullName()).append("\n");
        if (user.getCourse() != null)   prompt.append("- Course: ").append(user.getCourse()).append("\n");
        if (user.getSchool() != null)   prompt.append("- School: ").append(user.getSchool()).append("\n");
        if (user.getRegion() != null)   prompt.append("- Region: ").append(user.getRegion()).append("\n");
        if (user.getStatus() != null)   prompt.append("- Status: ").append(user.getStatus()).append("\n");
        if (user.getGraduationYear() != null) prompt.append("- Graduation year: ").append(user.getGraduationYear()).append("\n");

        if (!context.isEmpty()) {
            prompt.append("""

                Relevant information from official Philippine government sources:
                ---
                """);
            prompt.append(context);
            prompt.append("""
                ---
                Use this information to answer accurately. Always cite the source when using it.
                """);
        } else {
            prompt.append("""

                Answer based on your knowledge of Philippine government processes, job market, and finance.
                If unsure about exact requirements, advise the user to verify at the official government website.
                """);
        }

        if (!history.isEmpty()) {
            prompt.append("\n\nConversation history (most recent at bottom):\n");
            for (ConversationMessage msg : history) {
                String label = msg.getRole().equals("user") ? "User" : "Kuya AI";
                prompt.append(label).append(": ").append(msg.getContent()).append("\n");
            }
            prompt.append("\nContinue the conversation naturally based on the above context.\n");
        }

        return prompt.toString();
    }
}
