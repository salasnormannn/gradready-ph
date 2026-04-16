package com.gradready.feedback;

import lombok.Data;

@Data
public class FeedbackRequest {
    private String type;
    private String message;
    private String pageUrl;
}
