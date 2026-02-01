package com.artembredak.todoapp.Controller;


import com.artembredak.todoapp.Entity.TaskEntity;
import com.artembredak.todoapp.Service.TaskService;
import com.artembredak.todoapp.dto.TaskDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private  TaskService service;


    //creating a task
    @PostMapping("/create")
    public TaskEntity createTask(
            @Valid @RequestBody TaskDto taskDto,
            @RequestParam String username
    ) {

        return service.save(taskDto, username);
    }


    //all tasks
    @GetMapping
    public List<TaskEntity> findAllTasks(@RequestParam String username) {

        return service.findAll(username);
    }

    //update
    @PutMapping("/{taskId}")
    public TaskEntity updateTask(@RequestParam Long taskId, @RequestBody TaskDto taskDto) {
        return service.update(taskId, taskDto);
    }

    //delete
    @DeleteMapping("/{taskId}")
    public void deleteTask(@RequestParam Long taskId) {
        service.delete(taskId);
    }

    //task by status
    @GetMapping("/by-status")
    public List<TaskEntity> getByStatus(
            @RequestParam String username,
            @RequestParam TaskEntity.Status status
    ) {
        return service.findByStatus(username, status);
    }

}
