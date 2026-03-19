package com.gradready.roadmap;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RoadmapRepository extends JpaRepository<RoadmapItem, UUID> {
    List<RoadmapItem> findByUserIdOrderByWeekNumberAsc(UUID userId);
    boolean existsByUserId(UUID userId);
    long countByUserIdAndCompletedTrue(UUID userId);
    long countByUserId(UUID userId);
}