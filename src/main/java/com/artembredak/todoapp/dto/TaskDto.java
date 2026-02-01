package com.artembredak.todoapp.dto;

import com.artembredak.todoapp.Entity.TaskEntity.Priority;
import com.artembredak.todoapp.Entity.TaskEntity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TaskDto {


    @NotBlank
    private String title;
    private String description;

    @NotNull
    private Priority priority;

    @NotNull
    private Status status;


    public @NotBlank String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public @NotNull Priority getPriority() {
        return priority;
    }

    public void setPriority(@NotNull Priority priority) {
        this.priority = priority;
    }

    public @NotNull Status getStatus() {
        return status;
    }

    public void setStatus(@NotNull Status status) {
        this.status = status;
    }
}
