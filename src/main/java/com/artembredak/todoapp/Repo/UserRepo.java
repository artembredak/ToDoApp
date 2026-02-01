package com.artembredak.todoapp.Repo;


import com.artembredak.todoapp.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.config.Task;

import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEntity, Long> {

    UserEntity findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
   UserEntity findByEmailAndPassword(String email, String password);



}
