package com.candle.tasktracker.controller;

import com.candle.tasktracker.Service.TaskService;
import com.candle.tasktracker.dto.CreateTaskRequest;
import com.candle.tasktracker.dto.TaskDTO;
import com.candle.tasktracker.dto.UpdateTaskRequest;
import com.candle.tasktracker.model.*;
import com.candle.tasktracker.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskRepository taskRepository, UserRepository userRepository,
                          TaskService taskService) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskDTO> getTasksForUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = userRepository.findByUsername(userDetails.getUsername());
        List<Task> tasks = taskRepository.findByUserId(user.getId());
        return tasks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody CreateTaskRequest request,
                                              @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = userRepository.findByUsername(userDetails.getUsername());
        Task task = taskService.createNewTask(
                request.getTitle(),
                request.getDescription(),
                request.getDueDate(),
                user,
                request.getPriority(),
                "todo"
        );
        return ResponseEntity.ok(convertToDTO(task));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Integer taskId,
                                           @RequestBody UpdateTaskRequest request,
                                           Principal principal) {
        try {
            // Znajdź użytkownika
            UserEntity user = userRepository.findByUsername(principal.getName());

            // Aktualizuj zadanie
            Task updatedTask = taskService.updateTask(taskId, request.getTitle(), request.getDescription(),
                    request.getDueDate(), user, request.getPriority(), request.getStatus());

            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/complete/{taskId}")
    public ResponseEntity<Task> completeTask(@PathVariable Integer taskId,
                                             Principal principal) {
        try {
            // Znajdź użytkownika
            UserEntity user = userRepository.findByUsername(principal.getName());

            // Zmien status zadania na done
            Task updatedTask = taskService.completeTask(taskId, user);

            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

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
            dto.setPriority(task.getCurrentPriority().getPriorityName());
        }


        return dto;
    }
}
