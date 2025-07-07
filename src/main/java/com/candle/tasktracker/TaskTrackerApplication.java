package com.candle.tasktracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.candle.tasktracker")
@EnableJpaRepositories(basePackages = "com.candle.tasktracker.repository")
@EntityScan(basePackages = "com.candle.tasktracker.model")
public class TaskTrackerApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(TaskTrackerApplication.class, args);
//        var taskDisplayer = context.getBean(TaskDisplayer.class);
//        taskDisplayer.setTaskDisplay(new ConsoleDisplay());
//        taskDisplayer.displayMessage("OMG! Is this dependancies work?");
    }

}
