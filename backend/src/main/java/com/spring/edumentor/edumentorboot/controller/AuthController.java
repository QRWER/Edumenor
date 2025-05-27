package com.spring.edumentor.edumentorboot.controller;

import com.spring.edumentor.edumentorboot.dao.UserDAO;
import com.spring.edumentor.edumentorboot.entity.Mentor;
import com.spring.edumentor.edumentorboot.entity.Student;
import com.spring.edumentor.edumentorboot.entity.User;
import com.spring.edumentor.edumentorboot.service.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:3000")
public class AuthController {

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private ServiceImpl service;

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

    @PostMapping(value = "/mentor")
    public ResponseEntity<?> addMentor(@RequestBody Mentor mentor){
        Mentor newMentor = service.addMentor(mentor);
        return newMentor==null?ResponseEntity.badRequest().build():ResponseEntity.ok(newMentor);
    }

    @PostMapping(value = "/student")
    public ResponseEntity<?> addStudent(@RequestBody Student student){
        Student newStudent = service.addStudent(student);
        return newStudent==null?ResponseEntity.badRequest().build():ResponseEntity.ok(newStudent);
    }

    @PutMapping(value = "/password")
    public ResponseEntity<?> changePassword(@RequestParam String oldPassword,
                                            @RequestParam String newPassword){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userDAO.getByUsername(authentication.getName());
        if(passwordEncoder.matches(oldPassword, user.getPassword())){
            user.setPassword(passwordEncoder.encode(newPassword));
            userDAO.save(user);
            return ResponseEntity.ok("Password was changed.");
        }
        return ResponseEntity.badRequest().body("oldPassword doesn't match with current password");
    }

}