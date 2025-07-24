package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Id.TasksStatusId;
import com.candle.tasktracker.model.Task;
import com.candle.tasktracker.model.TasksStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TasksStatusRepository extends JpaRepository <TasksStatus, TasksStatusId> {
    Optional<TasksStatus> findByTask(Task task);

    @Modifying
    @Transactional
    @Query("DELETE FROM TasksStatus ts WHERE ts.task.task_id = :taskId")
    void deleteByTaskId(@Param("taskId") Integer taskId);
}
