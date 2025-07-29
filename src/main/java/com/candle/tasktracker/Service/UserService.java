package com.candle.tasktracker.Service;

import com.candle.tasktracker.dto.UserRegistrationDto;
import com.candle.tasktracker.model.UserEntity;
import com.candle.tasktracker.model.UsersRole;
import com.candle.tasktracker.repository.UserRepository;
import com.candle.tasktracker.repository.UsersRoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UsersRoleRepository usersRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       UsersRoleRepository usersRoleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.usersRoleRepository = usersRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerNewUser(UserRegistrationDto dto) {
        if (!dto.getPassword().equals(dto.getPasswordv2())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email is already used");
        }


        UserEntity user = new UserEntity();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setCreationDate(LocalDate.now());

        user = userRepository.save(user);


        UsersRole usersRole = new UsersRole();
        usersRole.setUser_id(user.getId());
        usersRole.setRole_id(2);

        usersRoleRepository.save(usersRole);
    }
}
