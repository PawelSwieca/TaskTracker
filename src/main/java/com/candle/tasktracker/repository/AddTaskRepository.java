package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddTaskRepository extends JpaRepository<Task, Integer> {

}

