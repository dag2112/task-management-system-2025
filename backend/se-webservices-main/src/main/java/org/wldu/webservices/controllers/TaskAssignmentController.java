package org.wldu.webservices.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.wldu.webservices.entities.TaskAssignment;
import org.wldu.webservices.services.contracts.TaskAssignmentService;

import java.util.List;

@RestController
@RequestMapping("/task-assignments")
public class TaskAssignmentController {

    private final TaskAssignmentService assignmentService;

    public TaskAssignmentController(TaskAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // ✅ ONLY ADMIN CAN ASSIGN TASKS
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<TaskAssignment> assignTask(
            @RequestParam Long taskId,
            @RequestParam Long workerId
    ) {
        return ResponseEntity.ok(
                assignmentService.assignTask(taskId, workerId)
        );
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<TaskAssignment>> getByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(
                assignmentService.getAssignmentsByTask(taskId)
        );
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<TaskAssignment>> getByWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(
                assignmentService.getAssignmentsByWorker(workerId)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unassign(@PathVariable Long id) {
        assignmentService.unassign(id);
        return ResponseEntity.noContent().build();
    }
}
