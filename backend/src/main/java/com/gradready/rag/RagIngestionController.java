package com.gradready.rag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class RagIngestionController {

    private final RagIngestionService ragIngestionService;

    @PostMapping("/ingest")
    public ResponseEntity<Map<String, String>> ingest() {
        ragIngestionService.ingestAllDocuments();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "All PH gov documents ingested into vector store"
        ));
    }
}