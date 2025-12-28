package org.wldu.webservices.services.contracts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wldu.webservices.entities.Task;
import org.wldu.webservices.entities.TaskAssignment;
import org.wldu.webservices.auths.Users;
import org.wldu.webservices.repositories.TaskAssignmentRepository;
import org.wldu.webservices.repositories.TaskRepository;
import org.wldu.webservices.auths.UsersRepository;

import java.util.List;

@Service
@Transactional
public class TaskAssignmentService {

    private final TaskAssignmentRepository assignmentRepository;
    private final TaskRepository taskRepository;
    private final UsersRepository usersRepository;

    public TaskAssignmentService(
            TaskAssignmentRepository assignmentRepository,
            TaskRepository taskRepository,
            UsersRepository usersRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.taskRepository = taskRepository;
        this.usersRepository = usersRepository;
    }

    public TaskAssignment assignTask(Long taskId, Long workerId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Users worker = usersRepository.findById(workerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ ONLY ROLE_WORKER CAN BE ASSIGNED
        if (!"ROLE_WORKER".equals(worker.getRole())) {
            throw new RuntimeException("User is not a WORKER");
        }

        TaskAssignment assignment = new TaskAssignment();
        assignment.setTask(task);
        assignment.setAssignee(worker);

        return assignmentRepository.save(assignment);
    }

    public List<TaskAssignment> getAssignmentsByTask(Long taskId) {
        return assignmentRepository.findByTaskId(taskId);
    }

    public List<TaskAssignment> getAssignmentsByWorker(Long workerId) {
        return assignmentRepository.findByAssigneeId(workerId);
    }

    public void unassign(Long assignmentId) {
        assignmentRepository.deleteById(assignmentId);
    }
}
