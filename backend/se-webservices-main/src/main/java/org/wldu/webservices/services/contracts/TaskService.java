package org.wldu.webservices.services.contracts;
import org.apache.catalina.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wldu.webservices.entities.Task;
import org.wldu.webservices.repositories.TaskRepository;
import org.wldu.webservices.constants.TaskConstants;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {

        // Default status
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus(TaskConstants.TODO);
        }

        // Default priority
        if (task.getPriority() == null || task.getPriority().isBlank()) {
            task.setPriority(TaskConstants.LOW);
        }

        return taskRepository.save(task);
    }


    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task updateTask(Long id, Task updated) {
        Task task = getTaskById(id);

        task.setTitle(updated.getTitle());
        task.setDescription(updated.getDescription());
        task.setStatus(updated.getStatus());

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(id);
    }
    public Task updateTaskStatus(Long id, String status, User currentUser) {
        Task task = getTaskById(id);

        // Check permissions
        if (!canUpdateStatus(currentUser, task)) {
            throw new AccessDeniedException("You don't have permission to update this task's status");
        }


        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    private boolean canUpdateStatus(User currentUser, Task task) {
                return false;
    }

}
