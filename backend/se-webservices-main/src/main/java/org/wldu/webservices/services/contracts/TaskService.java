package org.wldu.webservices.services.contracts;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.wldu.webservices.auths.User;
import org.wldu.webservices.auths.UserRepository;
import org.wldu.webservices.dtoFiles.TaskAssignRequest;
import org.wldu.webservices.dtoFiles.TaskCreateRequest;
import org.wldu.webservices.dtoFiles.TaskResponse;
import org.wldu.webservices.dtoFiles.TaskUpdateRequest;
import org.wldu.webservices.enities.*;
import org.wldu.webservices.repositories.CategoryRepository;
import org.wldu.webservices.repositories.TaskRepository;
import org.wldu.webservices.services.contracts.NotificationService;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationService notificationService;


    // 1️⃣ CREATE TASK
    public TaskResponse createTask(TaskCreateRequest request) {

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.PENDING);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            task.setCategory(category);
        }

        return map(taskRepository.save(task));
    }

    // 2️⃣ ASSIGN TASK
    public TaskResponse assignTask(TaskAssignRequest request) {

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setAssignedUser(user);
        taskRepository.save(task);

        // 🔔 NOTIFY USER
        notificationService.create(
                user,
                "You have been assigned a new task: " + task.getTitle()
        );

        return map(task);
    }


    // 3️⃣ GET ALL
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(this::map).collect(Collectors.toList());
    }

    // 4️⃣ GET UNASSIGNED
    public List<TaskResponse> getUnassignedTasks() {
        return taskRepository.findByAssignedUserIsNull().stream().map(this::map).toList();
    }

    // user task
    public List<TaskResponse> getTasksForUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskRepository.findByAssignedUserId(user.getId())
                .stream().map(this::map).toList();
    }


    // 6️⃣ GET BY CATEGORY
    public List<TaskResponse> getTasksByCategory(Long categoryId) {
        return taskRepository.findByCategoryId(categoryId).stream().map(this::map).toList();
    }

    public void updateTaskStatus(Long taskId, String status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(TaskStatus.valueOf(status));
        taskRepository.save(task);

        // 🔔 FIND ADMIN (SIMPLE WAY)
        User adminUser = userRepository.findByUsername("admin")
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // 🔔 NOTIFY ADMIN
        notificationService.create(
                adminUser,
                "Task '" + task.getTitle() + "' status updated to " + task.getStatus()
        );
    }


    // 🔹 MAPPER
    private TaskResponse map(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getAssignedUser() != null ? task.getAssignedUser().getUsername() : null,
                task.getCategory() != null ? task.getCategory().getName() : null,
                task.getDueDate()
        );
    }


    // 8️⃣ UPDATE TASK (ADMIN)
    public TaskResponse updateTask(Long taskId, TaskUpdateRequest request) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            task.setCategory(category);
        }

        return map(taskRepository.save(task));
    }

    // 9️⃣ DELETE TASK (ADMIN)
    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }


}
