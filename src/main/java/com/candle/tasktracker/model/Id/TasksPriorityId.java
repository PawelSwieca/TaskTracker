package com.candle.tasktracker.model.Id;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class TasksPriorityId implements Serializable {
    private int priority_id;
    private int task_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TasksPriorityId that = (TasksPriorityId) o;
        return task_id == that.task_id && priority_id == that.priority_id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(task_id, priority_id);
    }

}
