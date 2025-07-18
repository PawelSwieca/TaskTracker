package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Id.TasksStatusId;
import com.candle.tasktracker.model.Task;
import com.candle.tasktracker.model.TasksStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TasksStatusRepository extends JpaRepository <TasksStatus, TasksStatusId> {
    Optional<TasksStatus> findByTask(Task task);
}
