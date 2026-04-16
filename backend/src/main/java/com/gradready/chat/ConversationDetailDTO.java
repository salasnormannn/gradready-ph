package com.gradready.chat;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ConversationDetailDTO {
    private String id;
    private String title;
    private List<MessageDTO> messages;

    @Data
    @AllArgsConstructor
    public static class MessageDTO {
        private String role;   // "user" or "assistant"
        private String content;
        private LocalDateTime createdAt;
    }
}
