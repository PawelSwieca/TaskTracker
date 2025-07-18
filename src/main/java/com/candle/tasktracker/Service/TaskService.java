package com.candle.tasktracker.Service;

import com.candle.tasktracker.model.*;
import com.candle.tasktracker.repository.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class TaskService {
    private final AddTaskRepository addTaskRepository;
    private final PriorityRepository priorityRepository;
    private final TasksPriorityRepository tasksPriorityRepository;
    private final TasksStatusRepository tasksStatusRepository;
    private final StatusRepository statusRepository;

//    @PostConstruct
//    public void checkStatuses() {
//        System.out.println("Dostępne statusy w bazie:");
//        statusRepository.findAll().forEach(status ->
//                System.out.println("ID: " + status.getStatus_id() + ", Nazwa: " + status.getName()));
//    }


    @Autowired
    public TaskService(AddTaskRepository addTaskRepository,
                       PriorityRepository priorityRepository,
                       TasksPriorityRepository tasksPriorityRepository,
                       TasksStatusRepository tasksStatusRepository, StatusRepository statusRepository) {
        this.addTaskRepository = addTaskRepository;
        this.priorityRepository = priorityRepository;
        this.tasksPriorityRepository = tasksPriorityRepository;
        this.tasksStatusRepository = tasksStatusRepository;
        this.statusRepository = statusRepository;
    }


    public Task createNewTask(String title, String description, LocalDate dueDate, UserEntity user,
                              String priorityName, String statusName) {
        Task newTask = Task.builder()
                .title(title)
                .description(description)
                .creationDate(LocalDate.now())
                .dueDate(dueDate)
                .user(user)
                .build();

        Task savedTask = addTaskRepository.save(newTask);

        Priority priority = priorityRepository.findByPriorityName(priorityName.toLowerCase())
                .orElseThrow(() -> new RuntimeException("Priority not found: " + priorityName));

        TasksPriority tasksPriority = new TasksPriority(savedTask, priority);
        tasksPriorityRepository.save(tasksPriority);


        String normalizedStatus = normalizeStatus(statusName);
        Status status = statusRepository.findByNameIgnoreCase(normalizedStatus)
                .orElseThrow(() -> new RuntimeException("Status not found: " + statusName));

        TasksStatus tasksStatus = new TasksStatus(savedTask, status);
        tasksStatusRepository.save(tasksStatus);

        return savedTask;
    }

    public Task updateTask(Integer taskId, String title, String description, LocalDate dueDate,
                           UserEntity user, String priorityName, String statusName) {

        // Znajdź zadanie
        Task existingTask = addTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));


        if (!(existingTask.getUser().getId() == user.getId())) {
            throw new RuntimeException("Access denied: User is not owner of this task");
        }


        existingTask.setTitle(title);
        existingTask.setDescription(description);
        existingTask.setDueDate(dueDate);


        Task savedTask = addTaskRepository.save(existingTask);


        if (priorityName != null && !priorityName.isEmpty()) {
            updateTaskPriority(savedTask, priorityName);
        }
        if (statusName != null && !statusName.isEmpty()) {
            updateTaskStatus(savedTask, statusName);
        }

        return savedTask;
    }

    private String normalizeStatus(String status) {
        if (status == null) return "to do";

        status = status.toLowerCase();
        return switch (status) {
            case "todo" -> "to do";
            case "in_progress", "in progress" -> "in progress";
            case "done", "completed" -> "done";
            case "outdated", "overdue" -> "outdated";
            default -> status;
        };
    }

    private void updateTaskPriority(Task task, String priorityName) {

        Optional<TasksPriority> existingTaskPriority = tasksPriorityRepository.findByTask(task);


        Priority newPriority = priorityRepository.findByPriorityName(priorityName.toLowerCase())
                .orElseThrow(() -> new RuntimeException("Priority not found: " + priorityName));

        TasksPriority tasksPriority;
        if (existingTaskPriority.isPresent()) {

            tasksPriority = existingTaskPriority.get();
            tasksPriority.setPriority(newPriority);
        } else {

            tasksPriority = new TasksPriority(task, newPriority);
        }
        tasksPriorityRepository.save(tasksPriority);
    }

    private void updateTaskStatus(Task task, String statusName) {

        Optional<TasksStatus> existingTaskStatus = tasksStatusRepository.findByTask(task);


        Status newStatus = statusRepository.findByName(statusName.toLowerCase())
                .orElseThrow(() -> new RuntimeException("Priority not found: " + statusName));

        TasksStatus tasksStatus;
        if (existingTaskStatus.isPresent()) {

            tasksStatus = existingTaskStatus.get();
            tasksStatus.setStatus(newStatus);
        } else {

            tasksStatus = new TasksStatus(task, newStatus);
        }
        tasksStatusRepository.save(tasksStatus);
    }

}

