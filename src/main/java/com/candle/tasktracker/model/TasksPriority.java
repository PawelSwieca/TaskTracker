package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "tasks_priority")
public class TasksPriority {
    @Id
    private int task_id;
    @Id
    private int priority_id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "priority_id")
    @Getter
    private Priority priority;
}
