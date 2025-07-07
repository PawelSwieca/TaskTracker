package com.candle.tasktracker.dependancies;

public interface TaskDisplay {
    default void display(String message){
        System.out.println("Displaying " + message);
    }
}
