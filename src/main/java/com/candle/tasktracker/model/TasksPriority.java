package com.candle.tasktracker.model;

import com.candle.tasktracker.model.Id.TasksPriorityId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tasks_priority")
@IdClass(TasksPriorityId.class)
public class TasksPriority {
    @Id
    private int task_id;
    @Id
    private int priority_id;

    @ManyToOne
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    @Getter
    private Task task;

    @ManyToOne
    @JoinColumn(name = "priority_id", insertable = false, updatable = true)
    @Getter
    @Setter
    private Priority priority;


    public TasksPriority(Task task, Priority priority) {
        this.task_id = task.getTask_id();
        this.priority_id = priority.getPriority_id();
        this.task = task;
        this.priority = priority;
    }

    public TasksPriority() {

    }
}
