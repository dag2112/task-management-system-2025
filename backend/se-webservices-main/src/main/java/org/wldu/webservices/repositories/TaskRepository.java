package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wldu.webservices.enities.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUserId(Long userId);

    List<Task> findByAssignedUserIsNull(); //
    List<Task> findByCategoryId(Long categoryId);
// 🔹 UNASSIGNED TASKS
}
