package com.gradready.config;

import com.gradready.rag.RagIngestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final RagIngestionService ragIngestionService;
    private final VectorStore vectorStore;

    @Override
    public void run(ApplicationArguments args) {
        try {
            SearchRequest request = SearchRequest.builder()
                    .query("TIN registration Philippines")
                    .topK(1)
                    .build();

            var existing = vectorStore.similaritySearch(request);

            if (existing.isEmpty()) {
                log.info("Vector store empty — running initial RAG ingestion...");
                ragIngestionService.ingestAllDocuments();
            } else {
                log.info("Vector store already populated — skipping ingestion.");
            }
        } catch (Exception e) {
            log.warn("Could not check vector store on startup: {}", e.getMessage());
        }
    }
}