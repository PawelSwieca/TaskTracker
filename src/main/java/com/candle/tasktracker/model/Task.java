package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private int task_id;

    @ManyToOne
    @JoinColumn(name = "user_id") // klucz obcy do użytkownika
    private UserEntity user;

    @OneToMany(mappedBy = "task")
    private Set<TasksStatus> taskStatuses = new HashSet<>();


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
    private LocalDate completionDate;
}
