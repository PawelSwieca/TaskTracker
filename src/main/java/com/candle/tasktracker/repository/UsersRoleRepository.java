package com.candle.tasktracker.repository;

import com.candle.tasktracker.model.Id.UsersRoleId;
import com.candle.tasktracker.model.UsersRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRoleRepository extends JpaRepository<UsersRole, UsersRoleId> {
}
