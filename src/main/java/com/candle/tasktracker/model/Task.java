package com.candle.tasktracker.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor

public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    @Getter
    private int task_id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    @JsonIgnoreProperties({"tasks", "taskStatuses", "taskPriorities"})
    private UserEntity user;

    @OneToMany(mappedBy = "task")
    @JsonIgnore
    private Set<TasksStatus> taskStatuses = new HashSet<>();

    public Task(String title, String description, LocalDate dueDate, UserEntity user) {
        this.title = title;
        this.description = description;
        this.creationDate = LocalDate.now();
        this.dueDate = dueDate;
        this.user = user;
    }



    // Metoda pomocnicza do pobierania aktualnego statusu
    public Status getCurrentStatus() {
        if (taskStatuses == null || taskStatuses.isEmpty()) {
            return null;
        }
        // Zwróć status z najnowszej daty (jeśli masz pole daty w TasksStatus)
        // lub ostatni dodany status
        return taskStatuses.stream()
                .reduce((first, second) -> second) // bierze ostatni element
                .map(TasksStatus::getStatus)
                .orElse(null);
    }


    @OneToMany(mappedBy = "task")
    @JsonIgnore
    private Set<TasksPriority> taskPriorities = new HashSet<>();

    // Metoda pomocnicza do pobierania aktualnego priorytetu
    public Priority getCurrentPriority() {
        if (taskPriorities == null || taskPriorities.isEmpty()) {
            return null;
        }
        return taskPriorities.stream()
                .reduce((first, second) -> second) // bierze ostatni element
                .map(TasksPriority::getPriority)
                .orElse(null);
    }

    @Getter
    @Setter
    private String title;
    @Getter
    @Setter
    private String description;
    @Getter
    @Setter
    private LocalDate creationDate;
    @Getter
    @Setter
    private LocalDate dueDate;
    @Getter
    @Setter
    @Column(name = "completion_date")
    private LocalDate completionDate;
}
