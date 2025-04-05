package com.spring.edumentor.edumentorboot.controller;

import com.spring.edumentor.edumentorboot.dao.UserDAO;
import com.spring.edumentor.edumentorboot.entity.Role;
import com.spring.edumentor.edumentorboot.entity.User;
import com.spring.edumentor.edumentorboot.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:3000")
public class AuthController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping(value = "/register")
    public ResponseEntity<?> registerUser(@RequestBody User user){
        if(userDAO.getByUsername(user.getUsername())!= null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole());
        userDAO.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping(value = "/users")
    public ResponseEntity<?> getUsers(){
        return ResponseEntity.ok().body(userDAO.getAll());
    }
}
