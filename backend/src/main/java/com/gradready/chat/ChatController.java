package com.gradready.chat;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // ── Send a message ─────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(
                chatService.chat(userDetails.getUsername(), request));
    }

    // ── Conversation management ────────────────────────────────────────────────

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationSummaryDTO>> getConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                chatService.getConversations(userDetails.getUsername()));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationDetailDTO> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        return ResponseEntity.ok(
                chatService.getConversation(userDetails.getUsername(), id));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        chatService.deleteConversation(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Kuya AI is online! 🤙");
    }
}
