// backend/src/main/java/com/woldia/taskmanager/repository/TaskRepository.java
package com.woldia.taskmanager.repository;

import com.woldia.taskmanager.entity.Task;
import com.woldia.taskmanager.entity.Task.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProjectId(Long projectId, Pageable pageable);
    Page<Task> findByAssignedToId(Long userId, Pageable pageable);
    Page<Task> findByCreatedById(Long userId, Pageable pageable);
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    Page<Task> findByPriority(Task.Priority priority, Pageable pageable);
    List<Task> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);

    @Query("SELECT t FROM Task t WHERE " +
            "(:projectId IS NULL OR t.project.id = :projectId) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:priority IS NULL OR t.priority = :priority) AND " +
            "(:assignedTo IS NULL OR t.assignedTo.id = :assignedTo) AND " +
            "(LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Task> searchTasks(
            @Param("projectId") Long projectId,
            @Param("status") TaskStatus status,
            @Param("priority") Task.Priority priority,
            @Param("assignedTo") Long assignedTo,
            @Param("search") String search,
            Pageable pageable
    );
}