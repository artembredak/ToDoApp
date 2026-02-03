package com.artembredak.todoapp.service;

import com.artembredak.todoapp.entity.UserEntity;
import com.artembredak.todoapp.repo.UserRepo;
import com.artembredak.todoapp.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;


    //create reg
    public UserEntity register( UserDto userDto) {
        if (repo.existsByEmail(userDto.getEmail())) {
            throw new IllegalStateException("Email already exists");
        }

        UserEntity user = new UserEntity();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));

        return repo.save(user);
    }

    //findall
    public List<UserEntity> findAll() {
        return repo.findAll();
    }


    //find by email
    public Optional<UserEntity> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    //find by username
    public UserEntity findByUsername(String username) {
        return repo.findByUsername(username);
    }

    //login user
    public UserEntity login(String username, String password) {
        UserEntity user = repo.findByUsername(username);
        if (user == null) {
            throw new IllegalStateException("User not found");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }

        return user;
    }

    //delete user
    public void delete(String email, String password) {
        UserEntity user = repo.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Email not exists"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }

        repo.delete(user);
    }















}
