package com.candle.tasktracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class UpdateTaskRequest {
    @Getter
    @Setter
    private String title;
    @Getter
    @Setter
    private String description;
    @Getter
    @Setter
    private LocalDate dueDate;
    @Getter
    @Setter
    private String priority;
}
