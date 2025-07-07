package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "tasks_status")
public class TasksStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "status_id")
    @Getter
    private Status status;

}
