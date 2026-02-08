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


    //create
    public TaskEntity save(TaskDto dto,  String username) {
       UserEntity user = userRepo.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        TaskEntity task = new TaskEntity();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(TaskEntity.Status.TODO);
        task.setUser(user);

        return repo.save(task);

    }

    //find all
    public List<TaskEntity> findAll(String username) {
        List<TaskEntity> tasks = repo.findByUserUsername(username);

        tasks.sort((t1, t2) -> t2.getPriority().ordinal() - t1.getPriority().ordinal());

        return tasks;

    }

    //findByStatus
    public List<TaskEntity> findByStatus(String username, TaskEntity.Status status) {

        List<TaskEntity> tasks = repo.findByUserUsernameAndStatus(username, status);

        tasks.sort((t1, t2) -> t2.getPriority().ordinal() - t1.getPriority().ordinal());

        return tasks;
    }



    //update
    public TaskEntity update(Long taskId, TaskDto dto ) {

        Optional<TaskEntity> userTasks = repo.findById(taskId);

        TaskEntity task = userTasks.stream()
                .filter(t -> t.getTaskId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task not found for this user"));


        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());

        return repo.save(task);
    }




    //delete
    public void delete(Long taskId) {

        Optional<TaskEntity> userTasks = repo.findById(taskId);
        TaskEntity task = userTasks.stream()
                .filter(t -> t.getTaskId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task not found for this user"));

        repo.delete(task);


    }

}


