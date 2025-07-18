package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AddTaskRepository extends JpaRepository<Task, Integer> {

}

