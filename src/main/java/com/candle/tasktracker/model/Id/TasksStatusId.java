package com.candle.tasktracker.model.Id;

import com.candle.tasktracker.model.Task;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class TasksStatusId implements Serializable {
    private int status_id;
    private int task_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TasksStatusId that = (TasksStatusId) o;
        return task_id == that.task_id && status_id == that.status_id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(task_id, status_id);
    }
}
