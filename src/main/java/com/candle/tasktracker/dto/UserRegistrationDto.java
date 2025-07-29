package com.candle.tasktracker.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class UserRegistrationDto {
    @Getter
    @Setter
    private String username;
    @Getter
    @Setter
    private String password;
    @Getter
    @Setter
    private String passwordv2;

    @Getter
    @Setter
    private String email;
    @Getter
    @Setter
    private LocalDate creationDate;
}
