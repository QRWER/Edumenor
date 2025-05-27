package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
