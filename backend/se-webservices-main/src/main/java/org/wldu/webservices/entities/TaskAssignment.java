package org.wldu.webservices.entities;

import jakarta.persistence.*;
import org.wldu.webservices.auths.Users;

import java.time.LocalDateTime;

@Entity
@Table(name = "task_assignments")
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(optional = false)
    @JoinColumn(name = "assignee_id")
    private Users assignee;

    private LocalDateTime assignedAt;

    @PrePersist
    void assignedTime() {
        this.assignedAt = LocalDateTime.now();
    }

    // getters & setters
    public Long getId() { return id; }
    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }
    public Users getAssignee() { return assignee; }
    public void setAssignee(Users assignee) { this.assignee = assignee; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
}
