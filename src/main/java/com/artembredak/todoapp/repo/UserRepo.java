package com.artembredak.todoapp.repo;


import com.artembredak.todoapp.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserEntity, Long> {

    UserEntity findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    UserEntity findUserByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

}
