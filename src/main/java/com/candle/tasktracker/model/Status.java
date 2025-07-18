package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "status")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private int status_id;

    @Getter
    @Column(name = "name")
    private String name;

}
