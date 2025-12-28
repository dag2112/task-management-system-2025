package org.wldu.webservices.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.wldu.webservices.entities.TaskAssignment;

import java.util.List;

public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {

    List<TaskAssignment> findByTaskId(Long taskId);

    List<TaskAssignment> findByAssigneeId(Long assigneeId);
}
