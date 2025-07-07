package com.candle.tasktracker.controller;

import org.springframework.ui.Model;
import com.candle.tasktracker.model.Task;
import com.candle.tasktracker.model.UserEntity;
import com.candle.tasktracker.repository.TaskRepository;
import com.candle.tasktracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class HomeControler {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public HomeControler(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    @RequestMapping("/tasktracker")
    public String tasksPage(Model model, Authentication authentication) {
        String username = authentication.getName();

        // znajdź użytkownika po loginie
        UserEntity user = userRepository.findByUsername(username);
        List<Task> tasks = taskRepository.findByUserId(user.getId());

        model.addAttribute("tasks", tasks);
        return "tasktracker"; // tasktracker.html
    }
}
