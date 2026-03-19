package com.gradready.rag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RagQueryService {

    private final VectorStore vectorStore;

    public String getRelevantContext(String query) {
        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(4)
                .similarityThreshold(0.65)
                .build();

        List<Document> results = vectorStore.similaritySearch(request);

        if (results.isEmpty()) {
            return "";
        }

        return results.stream()
                .map(doc -> "Source: "
                        + doc.getMetadata().getOrDefault("source", "Unknown")
                        + "\n" + doc.getContent())
                .collect(Collectors.joining("\n\n---\n\n"));
    }
}