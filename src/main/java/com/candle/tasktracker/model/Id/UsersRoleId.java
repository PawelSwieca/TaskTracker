package com.candle.tasktracker.model.Id;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class UsersRoleId implements Serializable {
    private int role_id;
    private int user_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UsersRoleId that = (UsersRoleId) o;
        return user_id == that.user_id && role_id == that.role_id;
    }
    @Override
    public int hashCode() {
        return Objects.hash(role_id, user_id);
    }
}
