package com.gradready.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ChatResponse {
    private String message;
    private String conversationId;
    private String source;
}