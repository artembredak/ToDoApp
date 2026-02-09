package com.artembredak.todoapp.controller;


import com.artembredak.todoapp.entity.TaskEntity;
import com.artembredak.todoapp.service.TaskService;
import com.artembredak.todoapp.dto.TaskDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    @Autowired
    private TaskService service;

    @PostMapping("/create")
    public TaskEntity createTask(
            @Valid @RequestBody TaskDto taskDto,
            @RequestParam String username,
            @RequestParam String email
    ) {
        return service.save(taskDto, username, email);
    }

    @GetMapping
    public List<TaskEntity> findAllTasks(
            @RequestParam String username,
            @RequestParam String email
    ) {
        return service.findAll(username, email);
    }

    @PutMapping("/{taskId}")
    public TaskEntity updateTask(@RequestParam Long taskId, @RequestBody TaskDto taskDto) {
        return service.update(taskId, taskDto);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@RequestParam Long taskId) {
        service.delete(taskId);
    }

    @GetMapping("/by-status")
    public List<TaskEntity> getByStatus(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam TaskEntity.Status status
    ) {
        return service.findByStatus(username, email, status);
    }
}
