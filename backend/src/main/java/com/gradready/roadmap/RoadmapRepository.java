package com.gradready.roadmap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface RoadmapRepository extends JpaRepository<RoadmapItem, UUID> {
    List<RoadmapItem> findByUserIdOrderByWeekNumberAsc(UUID userId);
    boolean existsByUserId(UUID userId);
    long countByUserIdAndCompletedTrue(UUID userId);
    long countByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM RoadmapItem r WHERE r.user.id = :userId")
    void deleteByUserId(UUID userId);
}