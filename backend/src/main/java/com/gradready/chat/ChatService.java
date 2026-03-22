package com.gradready.chat;

import com.gradready.rag.RagQueryService;
import com.gradready.user.User;
import com.gradready.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder chatClientBuilder;
    private final RagQueryService ragQueryService;
    private final UserRepository userRepository;

    public ChatResponse chat(String email, ChatRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String context = ragQueryService.getRelevantContext(request.getMessage());
        String conversationId = request.getConversationId() != null
                ? request.getConversationId()
                : UUID.randomUUID().toString();

        String systemPrompt = buildSystemPrompt(user, context);
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
                                .build()
                )
                .build()
                .prompt()
                .system(systemPrompt)
                .user(request.getMessage())
                .call()
                .content();

        return ChatResponse.builder()
                .message(response)
                .conversationId(conversationId)
                .source(context.isEmpty() ? "general" : "rag")
                .build();
    }

    private String buildSystemPrompt(User user, String context) {
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

        if (user.getCourse() != null)
            prompt.append("- Course: ").append(user.getCourse()).append("\n");
        if (user.getSchool() != null)
            prompt.append("- School: ").append(user.getSchool()).append("\n");
        if (user.getRegion() != null)
            prompt.append("- Region: ").append(user.getRegion()).append("\n");
        if (user.getStatus() != null)
            prompt.append("- Status: ").append(user.getStatus()).append("\n");
        if (user.getGraduationYear() != null)
            prompt.append("- Graduation year: ").append(user.getGraduationYear()).append("\n");

        if (!context.isEmpty()) {
            prompt.append("""
                
                Relevant information from official Philippine government sources:
                ---
                """);
            prompt.append(context);
            prompt.append("""
                ---
                Use this information to answer accurately. Always cite the source (BIR, SSS, PhilHealth, etc.)
                when using it. If the information doesn't cover the question fully, supplement with your knowledge
                but make it clear what is official vs general advice.
                """);
        } else {
            prompt.append("""
                
                Answer based on your knowledge of Philippine government processes, job market, and finance.
                Be specific to the Philippine context. If you're not sure about exact requirements,
                advise the user to verify at the official government website.
                """);
        }

        return prompt.toString();
    }
}