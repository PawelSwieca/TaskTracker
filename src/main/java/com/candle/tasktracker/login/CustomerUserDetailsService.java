package com.candle.tasktracker.login;

import com.candle.tasktracker.model.UserEntity;
import com.candle.tasktracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomerUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository; // DAO lub JpaRepository

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username);

        return User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash()) // już zaszyfrowane
                .roles("USER") // lub pobierz z tabeli users_role
                .build();
    }
}
