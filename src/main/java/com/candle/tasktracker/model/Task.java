package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int task_id;

    @ManyToOne
    @JoinColumn(name = "user_id") // klucz obcy do użytkownika
    private UserEntity user;

    @OneToMany(mappedBy = "task")
    private List<TasksStatus> taskStatuses;

    // Metoda pomocnicza do pobierania aktualnego statusu
    public Status getCurrentStatus() {
        if (taskStatuses == null || taskStatuses.isEmpty()) {
            return null;
        }
        // Zakładając, że ostatni status w liście jest aktualny
        return taskStatuses.get(taskStatuses.size() - 1).getStatus();
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
