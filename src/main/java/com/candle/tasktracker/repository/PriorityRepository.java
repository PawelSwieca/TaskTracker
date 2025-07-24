package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Priority;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PriorityRepository extends JpaRepository<Priority, Integer> {
    Optional<Priority> findByPriorityName(String priorityName);
}