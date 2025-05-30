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
@RequestMapping("/mentor")
@CrossOrigin("http://localhost:3000")
public class MentorController {

    @Autowired
    private ServiceImpl service;
    @Autowired
    private MentorDAO mentorDAO;
    @Autowired
    private UserDAO userDAO;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userDAO.getByUsername(((UserDetails) auth.getPrincipal()).getUsername());
        return ResponseEntity.ok(service.getMentorById(user.getId()));
    }

    @GetMapping("/students")
    public ResponseEntity<?> showStudentsByName(@RequestParam(required = false, value = "name") String name){
        List<Student> students = name!=null?service.getStudentByName(name):service.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/student/{idStudent}")
    public ResponseEntity<?> showStudentById(@PathVariable("idStudent") int id){
        Student student = service.getStudentById(id);
        return student==null?ResponseEntity.notFound().build():ResponseEntity.ok(student);
    }

    @GetMapping("/homework")
    public ResponseEntity<?> showAllHomeworkByMentor(@RequestParam("idMentor") int id){
        List<Homework> homeworks = service.getAllHomeworkForMentor(id);
        return ResponseEntity.ok(homeworks);
    }

    @GetMapping("/homework/{idHomework}")
    public ResponseEntity<?> showHomeworkById(@PathVariable("idHomework") int id){
        Homework homework = service.getHomeworkById(id);
        return homework==null?ResponseEntity.notFound().build():ResponseEntity.ok(homework);
    }

    @GetMapping("/solution/{idHomework}")
    public ResponseEntity<?> showSolutionForHomework(@PathVariable("idHomework") int id){
        Solution solution = service.getSolution(id);
        return ResponseEntity.ok(solution);
    }

    @GetMapping("/review/{idHomework}")
    public ResponseEntity<?> showReviewForHomework(@PathVariable("idHomework") int id){
        Review review = service.getReviewById(id);
        return ResponseEntity.ok(review);
    }

    @PostMapping(value = "/homework", consumes = {MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addHomework(@RequestParam int idMentor,
                                @RequestParam int idStudent,
                                @RequestParam MultipartFile task) throws IOException {
        Homework newHomework = service.addHomework(new Homework(idMentor, idStudent, task.getBytes()));
        return newHomework==null?ResponseEntity.badRequest().build():ResponseEntity.ok(newHomework);
    }

    @PostMapping("/review")
    public ResponseEntity<?> addReview(@RequestBody Review review){
        review.setTimeCreate(new Timestamp(new Date().getTime()));
        Review newReview = service.addReview(review);
        return newReview==null?ResponseEntity.badRequest().build():ResponseEntity.ok(newReview);
    }

    @PutMapping("/review")
    public ResponseEntity<?> updateReview(@RequestBody Review review){
        review.setTimeCreate(new Timestamp(new Date().getTime()));
        Review newReview = service.addReview(review);
        return newReview==null?ResponseEntity.badRequest().build():ResponseEntity.ok(newReview);
    }

    @PutMapping(value = "/homework", consumes = {MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateHomework(@RequestParam int id,
                                            @RequestParam int id_mentor,
                                            @RequestParam int id_student,
                                            @RequestParam MultipartFile task) throws IOException {
        Homework findHomework = service.getHomeworkById(id);
        findHomework.setTask(task.getBytes());
        Homework updatedHomework = service.addHomework(findHomework);
        return updatedHomework==null?ResponseEntity.badRequest().build():ResponseEntity.ok(updatedHomework);
    }

    @DeleteMapping(value = "/homework", consumes = {MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> deleteHomework(@RequestParam int id,
                                            @RequestParam int idMentor,
                                            @RequestParam int idStudent,
                                            @RequestParam MultipartFile task){
        if (service.getSolution(id)!=null)
            service.deleteSolution(id);
        if (service.getReviewById(id)!=null)
            service.deleteReview(id);
        service.deleteHomework(id);
        return ResponseEntity.ok(null);
    }

}
