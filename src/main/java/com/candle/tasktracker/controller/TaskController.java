package com.candle.tasktracker.controller;

import com.candle.tasktracker.dto.TaskDTO;
import com.candle.tasktracker.model.Task;
import com.candle.tasktracker.model.UserEntity;
import com.candle.tasktracker.repository.TaskRepository;
import com.candle.tasktracker.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<TaskDTO> getTasksForUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = userRepository.findByUsername(userDetails.getUsername());
        List<Task> tasks = taskRepository.findByUserId(user.getId());
        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getTask_id());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setCreationDate(task.getCreationDate());
        dto.setDueDate(task.getDueDate());
        dto.setCompletionDate(task.getCompletionDate());

        // Pobieranie statusu z relacji
        if (task.getCurrentStatus() != null) {
            dto.setStatus(task.getCurrentStatus().getName());
        } else {
            // Logika określania domyślnego statusu
            if (task.getCompletionDate() != null) {
                dto.setStatus("COMPLETED");
            } else if (task.getDueDate() != null && task.getDueDate().isBefore(java.time.LocalDate.now())) {
                dto.setStatus("OVERDUE");
            } else {
                dto.setStatus("TODO");
            }
        }
        // Pobieranie priorytetu z relacji
        if (task.getCurrentPriority() != null) {
            dto.setPriority(task.getCurrentPriority().getPriority_name());
        }


        return dto;
    }
}
