package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Id.TasksPriorityId;
import com.candle.tasktracker.model.Task;
import com.candle.tasktracker.model.TasksPriority;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TasksPriorityRepository extends JpaRepository<TasksPriority, TasksPriorityId>
{
    Optional<TasksPriority> findByTask(Task task);

    @Modifying
    @Transactional
    @Query("DELETE FROM TasksPriority tp WHERE tp.task.task_id = :taskId")
    void deleteByTaskId(@Param("taskId") Integer taskId);
}
