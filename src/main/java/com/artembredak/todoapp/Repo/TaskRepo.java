package com.artembredak.todoapp.Repo;

import com.artembredak.todoapp.Entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface TaskRepo extends JpaRepository<TaskEntity, Long> {

    List<TaskEntity> findByUserUsername(String username);

    List<TaskEntity> findByUserUsernameAndStatus(String username, TaskEntity.Status status);

    Optional<TaskEntity> findById(Long taskId);




}
