package org.wldu.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.wldu.webservices.entities.Task;


public interface TaskRepository extends JpaRepository <Task,Long>{
}
