package com.candle.tasktracker.dependancies;

import org.springframework.stereotype.Service;

@Service
public class PopupDisplay implements TaskDisplay {

    @Override
    public void display(String message) {
        System.out.println("[TaskTracker] " + message);
    }
}
