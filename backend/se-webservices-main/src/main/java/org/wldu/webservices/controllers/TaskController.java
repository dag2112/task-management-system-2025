package org.wldu.webservices.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.dtoFiles.TaskAssignRequest;
import org.wldu.webservices.dtoFiles.TaskCreateRequest;
import org.wldu.webservices.dtoFiles.TaskResponse;
import org.wldu.webservices.dtoFiles.TaskUpdateRequest;
import org.wldu.webservices.enities.*;
import org.wldu.webservices.services.contracts.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> create(@RequestBody TaskCreateRequest request) {
        return ResponseEntity.ok(taskService.createTask(request));
    }

    @PutMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> assign(@RequestBody TaskAssignRequest request) {
        return ResponseEntity.ok(taskService.assignTask(request));
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TaskResponse>> all() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/unassigned")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TaskResponse>> unassigned() {
        return ResponseEntity.ok(taskService.getUnassignedTasks());
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TaskResponse>> myTasks(Authentication auth) {
        return ResponseEntity.ok(
                taskService.getTasksForUsername(auth.getName())
        );
    }


    @GetMapping("/category/{categoryId}")

    public ResponseEntity<List<TaskResponse>> byCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(taskService.getTasksByCategory(categoryId));
    }

    @PutMapping("/status/{taskId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long taskId,
            @RequestParam String status
    ) {
        taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.ok().build();
    }

    //  UPDATE TASK
    @PutMapping("/update/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskUpdateRequest request) {

        return ResponseEntity.ok(taskService.updateTask(taskId, request));
    }

    // DELETE TASKS
    @DeleteMapping("/delete/{taskId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTask(@PathVariable Long taskId) {

        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Task deleted successfully");
    }

}
