package com.candle.tasktracker.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskDTO {
    private int id;
    private String title;
    private String description;
    private LocalDate creationDate;
    private LocalDate dueDate;
    private LocalDate completionDate;
    private String status;
    private String priority;
}
