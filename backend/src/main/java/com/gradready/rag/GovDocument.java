package com.gradready.rag;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GovDocument {
    private String source;
    private String title;
    private String content;
}