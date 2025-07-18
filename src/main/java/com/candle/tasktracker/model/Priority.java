package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "priority")
public class Priority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private int priority_id;

    @Getter
    @Column(name = "priority_name")
    private String priorityName;
}
