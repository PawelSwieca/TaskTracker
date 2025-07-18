package com.candle.tasktracker.model;

import com.candle.tasktracker.model.Id.TasksStatusId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tasks_status")
@IdClass(TasksStatusId.class)
public class TasksStatus {
    @Id
    private int task_id;
    @Id
    private int status_id;

    @ManyToOne
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    @Getter
    private Task task;

    @ManyToOne
    @JoinColumn(name = "status_id", insertable = false, updatable = true)
    @Getter
    @Setter
    private Status status;

    public TasksStatus(){}

    public TasksStatus(Task task, Status status){
        this.task_id = task.getTask_id();
        this.status_id = status.getStatus_id();
        this.task = task;
        this.status = status;
    }

}
