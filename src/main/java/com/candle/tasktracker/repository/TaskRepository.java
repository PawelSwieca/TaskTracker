package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("SELECT t FROM Task t " +
            "LEFT JOIN FETCH t.taskStatuses ts " +
            "LEFT JOIN FETCH ts.status s " +
            "WHERE t.user.id = :userId")
    List<Task> findByUserId(int userId);
}
