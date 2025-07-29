package com.candle.tasktracker.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.awt.geom.GeneralPath;

@Entity
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private int role_id;

    @Getter
    @Setter
    @Column(name = "role_name")
    private String roleName;

    @Getter
    @Setter
    @Column(name = "description")
    private String description;
}
