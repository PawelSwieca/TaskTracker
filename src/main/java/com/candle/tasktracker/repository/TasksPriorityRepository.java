package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Id.TasksPriorityId;
import com.candle.tasktracker.model.Task;
import com.candle.tasktracker.model.TasksPriority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TasksPriorityRepository extends JpaRepository<TasksPriority, TasksPriorityId>
{
    Optional<TasksPriority> findByTask(Task task);
}
