package com.candle.tasktracker.model;

import com.candle.tasktracker.model.Id.UsersRoleId;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users_role")
@IdClass(UsersRoleId.class)
@AllArgsConstructor
@NoArgsConstructor
public class UsersRole {
    @Id
    @Getter
    @Setter
    @Column(name = "role_id", nullable = false)
    private int role_id;

    @Id
    @Getter
    @Setter
    @Column(name = "user_id", nullable = false)
    private int user_id;

    @ManyToOne
    @JoinColumn(name = "role_id", insertable = false)
    @Getter
    private Role role;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @Getter
    private UserEntity user;

}
