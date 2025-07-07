package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Getter
    @Setter
    private String username;

    @Getter
    @Setter
    @Column(name = "password_hash")
    private String passwordHash;

    private String email;

    @Column(name = "creation_date")
    private LocalDate creationDate;
}
