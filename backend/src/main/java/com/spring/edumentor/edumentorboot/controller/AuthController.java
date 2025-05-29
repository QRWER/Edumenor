package com.spring.edumentor.edumentorboot.controller;

import com.spring.edumentor.edumentorboot.dao.*;
import com.spring.edumentor.edumentorboot.entity.Mentor;
import com.spring.edumentor.edumentorboot.entity.Role;
import com.spring.edumentor.edumentorboot.entity.Student;
import com.spring.edumentor.edumentorboot.entity.User;
import com.spring.edumentor.edumentorboot.service.JwtService;
import com.spring.edumentor.edumentorboot.service.ServiceImpl;
import com.spring.edumentor.edumentorboot.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;

import java.security.Principal;
import java.util.Map;
import java.util.stream.Collectors;

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
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private MentorDAO mentorDAO;
    @Autowired
    private StudentDAO studentDAO;

    @PostMapping(value = "/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequestDTO registerRequestDTO) {
        User user = userDAO.getByUsername(registerRequestDTO.getUsername());
        if(user != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        user = new User(0, registerRequestDTO.getUsername(), passwordEncoder.encode(registerRequestDTO.getPassword()), registerRequestDTO.getRole().equals(Role.ROLE_MENTOR.toString())?Role.ROLE_MENTOR:Role.ROLE_STUDENT);
        userDAO.save(user);
        user = userDAO.getByUsername(registerRequestDTO.getUsername());
        if(registerRequestDTO.getRole().equals("ROLE_MENTOR")) {
            mentorDAO.save(new Mentor(user.getId(), registerRequestDTO.getFullname(), registerRequestDTO.getSubject(), registerRequestDTO.getEducation()));
        }
        else if(registerRequestDTO.getRole().equals("ROLE_STUDENT")) {
            studentDAO.save(new Student(user.getId(), registerRequestDTO.getFullname(), registerRequestDTO.getSubject()));
        }
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtService.generateToken(auth);
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        "token=" + token +
                                "; Path=/; " +
                                "Max-Age=" + 86400 + // 24 часа
                                "; Secure; " +
                                "HttpOnly; " +
                                "SameSite=Strict"
                )
                .body(Map.of(
                        "id", userDAO.getByUsername(userDetails.getUsername()).getId(),
                        "username", userDetails.getUsername(),
                        "roles", userDetails.getAuthorities().stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList())
                ));
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

    @GetMapping("/valid")
    public ResponseEntity<?> validateToken() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
            UserDetails userDetails = (UserDetails) auth.getPrincipal();

            return ResponseEntity.ok(Map.of(
                    "id", userDAO.getByUsername(userDetails.getUsername()).getId(),
                    "username", userDetails.getUsername(),
                    "roles", userDetails.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList())
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE,
                        "token=; " +
                                "Path=/; " +
                                "Max-Age=0; " +
                                "Secure; " +
                                "HttpOnly; " +
                                "SameSite=Strict"
                )
                .build();
    }

}