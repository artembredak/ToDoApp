package com.artembredak.todoapp.controller;

import com.artembredak.todoapp.entity.UserEntity;
import com.artembredak.todoapp.service.UserService;
import com.artembredak.todoapp.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    //create user
    @PostMapping("/register")
    public UserEntity createUser(@RequestBody @Valid  UserDto dto) {

        return service.register(dto);
    }

    //find all users
    @GetMapping("/find")
    public List<UserEntity> getUsers() {
        return service.findAll();
    }

    //find by email
    @GetMapping("/email/{email}")
    public Optional<UserEntity> getUserByEmail(@PathVariable String email) {
        return service.findByEmail(email);
    }

    //find by username
    @GetMapping("/username/{username}")
    public UserEntity getUserByUsername(@PathVariable String username) {
        return service.findByUsername(username);
    }

    //login
    @PostMapping("/login")
    public UserEntity login(@RequestParam String username, @RequestParam String password) {
        return service.login(username, password);
    }

    //delete
    @DeleteMapping("/delete")
    public void deleteUser(@RequestParam String email, @RequestParam String password) {
     service.delete(email, password);
    }


}
