package com.gradready.feedback;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    @Query("SELECT f FROM Feedback f LEFT JOIN FETCH f.user ORDER BY f.createdAt DESC")
    List<Feedback> findAllWithUser();

    @Query("SELECT f FROM Feedback f LEFT JOIN FETCH f.user WHERE f.type = :type ORDER BY f.createdAt DESC")
    List<Feedback> findByTypeWithUser(@Param("type") String type);

    long countByType(String type);
}
