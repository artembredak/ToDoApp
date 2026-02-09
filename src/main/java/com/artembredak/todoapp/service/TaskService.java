package com.artembredak.todoapp.service;


import com.artembredak.todoapp.entity.TaskEntity;
import com.artembredak.todoapp.entity.UserEntity;
import com.artembredak.todoapp.repo.TaskRepo;
import com.artembredak.todoapp.repo.UserRepo;
import com.artembredak.todoapp.dto.TaskDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class TaskService {

    @Autowired
    private TaskRepo repo;

    @Autowired
    private UserRepo userRepo;

    public TaskEntity save(TaskDto dto, String username, String email) {
        UserEntity user = findAndValidateUser(username, email);

        TaskEntity task = new TaskEntity();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(TaskEntity.Status.TODO);
        task.setUser(user);

        return repo.save(task);
    }

    public List<TaskEntity> findAll(String username, String email) {
        findAndValidateUser(username, email);
        List<TaskEntity> tasks = repo.findByUserUsername(username);
        tasks.sort((t1, t2) -> t2.getPriority().ordinal() - t1.getPriority().ordinal());
        return tasks;
    }

    public List<TaskEntity> findByStatus(String username, String email, TaskEntity.Status status) {
        findAndValidateUser(username, email);
        List<TaskEntity> tasks = repo.findByUserUsernameAndStatus(username, status);
        tasks.sort((t1, t2) -> t2.getPriority().ordinal() - t1.getPriority().ordinal());
        return tasks;
    }

    public TaskEntity update(Long taskId, TaskDto dto) {
        TaskEntity task = repo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        return repo.save(task);
    }

    public void delete(Long taskId) {
        TaskEntity task = repo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        repo.delete(task);
    }

    private UserEntity findAndValidateUser(String username, String email) {
        UserEntity user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found by username");
        }
        if (!user.getEmail().equals(email)) {
            throw new RuntimeException("Username and email do not match the same account");
        }
        return user;
    }
}


