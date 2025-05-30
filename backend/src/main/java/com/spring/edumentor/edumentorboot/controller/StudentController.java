package com.spring.edumentor.edumentorboot.controller;

import com.spring.edumentor.edumentorboot.dao.MentorDAO;
import com.spring.edumentor.edumentorboot.dao.UserDAO;
import com.spring.edumentor.edumentorboot.entity.*;
import com.spring.edumentor.edumentorboot.service.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/student")
@CrossOrigin("http://localhost:3000")
public class StudentController {
    @Autowired
    private ServiceImpl service;

    @Autowired
    private UserDAO userDAO;
    @Autowired
    private MentorDAO mentorDAO;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userDAO.getByUsername(((UserDetails) auth.getPrincipal()).getUsername());
        return ResponseEntity.ok(service.getStudentById(user.getId()));
    }

    @GetMapping("/homework")
    public ResponseEntity<?> showAllHomeworkForStudent(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userDAO.getByUsername(((UserDetails) auth.getPrincipal()).getUsername());
        List<Homework> homeworks = service.getAllHomeworkForStudent(user.getId());
        return ResponseEntity.ok(homeworks);
    }

    @GetMapping("/mentors")
    public ResponseEntity<?> showAllMentorsForStudent(){
        List<Mentor> mentors = mentorDAO.getAll();
        System.out.println("Я ТУТА: " + mentors);
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/mentor/{idMentor}")
    public ResponseEntity<?> showMentorForStudent(@PathVariable int idMentor){
        Mentor mentor = service.getMentorById(idMentor);
        return mentor==null?ResponseEntity.notFound().build():ResponseEntity.ok(mentor);
    }

    @GetMapping("/homework/{idHomework}")
    public ResponseEntity<?> showHomeworkById(@PathVariable("idHomework") int id){
        Homework homework = service.getHomeworkById(id);
        return homework==null?ResponseEntity.notFound().build():ResponseEntity.ok(homework);
    }

    @GetMapping("/solution/{idHomework}")
    public ResponseEntity<?> showSolutionForHomework(@PathVariable("idHomework") int id){
        Solution solution = service.getSolution(id);
        System.out.println("РЕШЕНИЕ!!!!!" + solution);
        return ResponseEntity.ok(solution);
    }

    @GetMapping("/review/{idHomework}")
    public ResponseEntity<?> showReviewForHomework(@PathVariable("idHomework") int id){
        Review review = service.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @PostMapping(value = "/solution", consumes = {MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addSolution(@RequestParam int id,
                                         @RequestParam MultipartFile file) throws IOException {
        Solution solution = service.addSolution(new Solution(id, file.getBytes()));
        return solution==null?ResponseEntity.badRequest().build():ResponseEntity.ok(solution);
    }

    @PutMapping(value = "/solution", consumes = {MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateSolution(@RequestParam int id,
                                            @RequestParam MultipartFile file) throws IOException {
        Solution findSolution = service.getSolution(id);
        findSolution.setPhoto(file.getBytes());
        findSolution.setTimeCreate(new Timestamp(new Date().getTime()));
        Solution updatedSolution = service.addSolution(findSolution);
        return updatedSolution==null?ResponseEntity.badRequest().build():ResponseEntity.ok(updatedSolution);
    }

    @DeleteMapping(value = "/solution/{idHomework}")
    public ResponseEntity<?> deleteSolution(@PathVariable("idHomework") int id){
        service.deleteSolution(id);
        return ResponseEntity.ok(null);
    }
}
