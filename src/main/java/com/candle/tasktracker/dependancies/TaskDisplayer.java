package com.candle.tasktracker.dependancies;

import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
@Setter
public class TaskDisplayer {
    private TaskDisplay taskDisplay;

    public TaskDisplayer() {
        this.taskDisplay = new PopupDisplay();
    }

    public void displayMessage(String message) {
        taskDisplay.display(message);
    }
}

