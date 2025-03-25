package com.spring.edumentor.edumentorboot.controller;

import com.spring.edumentor.edumentorboot.entity.Homework;
import com.spring.edumentor.edumentorboot.entity.Mentor;
import com.spring.edumentor.edumentorboot.entity.Solution;
import com.spring.edumentor.edumentorboot.entity.Student;
import com.spring.edumentor.edumentorboot.service.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/edumentor")
public class RESTController {

    @Autowired
    private ServiceImpl service;

    @GetMapping("/mentor")
    public List<Mentor> showAllMentors(){
        return service.getAllMentors();
    }

    @GetMapping("/students")
    public List<Student> showAllStudents(){
        return service.getAllStudents();
    }

    @GetMapping("/homework")
    public List<Homework> showAllHomework(){
        return service.getAllHomework();
    }

    @GetMapping("/solution/{id}")
    public Solution showSolution(@PathVariable("id") int id){
        Solution solution =  service.getSolution(id);
        if(solution == null)
            throw new NoSuchElementException("Задания с Id = " + id + " не существует");
        return solution;
    }

    @GetMapping("/homework/{id}")
    public List<Homework> showAllHomeworkForStudent(@PathVariable("id") int id){
        List<Homework> homeworks = service.getAllHomeworkForStudent(id);
        if(homeworks.isEmpty())
            throw new NoSuchElementException("Студента с Id = " + id + " не существует");
        return homeworks;
    }

    @GetMapping("/student/{id}")
    public Student showStudent(@PathVariable("id") int id){
        Student student = service.getStudentById(id);
        if(student == null)
            throw new NoSuchElementException("Студента с Id = " + id + " не существует");
        return student;
    }

    @GetMapping("/mentor/{id}")
    public Mentor showMentor(@PathVariable("id") int id){
        Mentor mentor = service.getMentorById(id);
        if(mentor == null)
            throw new NoSuchElementException("Преподавателя с Id = " + id + " не существует");
        return mentor;
    }

    @PostMapping(value = "/homework", consumes = {MULTIPART_FORM_DATA_VALUE})
    public Homework addHomework(@RequestParam int id_mentor,
                                @RequestParam int id_student,
                                @RequestParam MultipartFile task) throws IOException {
        return service.addHomework(new Homework(id_mentor, id_student, task.getBytes()));
    }

    @PostMapping(value = "/solution", consumes = {MULTIPART_FORM_DATA_VALUE})
    public Solution addSolution(@RequestParam MultipartFile file) throws IOException {
        Solution solution = new Solution(file.getBytes());
        return service.addSolution(solution);
    }

    @PostMapping(value = "/student", consumes = {MULTIPART_FORM_DATA_VALUE})
    public Student addStudent(@RequestParam String name,
                              @RequestParam String school){
        return service.addStudent(new Student(0, name, school));
    }

    @PostMapping(value = "/mentor", consumes = {MULTIPART_FORM_DATA_VALUE})
    public Mentor addMentor(@RequestParam String name,
                            @RequestParam String subject,
                            @RequestParam String education){
        Mentor mentor = new Mentor(name, subject, education);
        return service.addMentor(mentor);
    }

    @PutMapping("/homework")
    public Homework updateHomework(@RequestBody Homework homework){
        return service.addHomework(homework);
    }

    @PutMapping("/solution")
    public Solution updateSolution(@RequestBody Solution solution){
        return service.addSolution(solution);
    }

    @PutMapping("/student")
    public Student updateStudent(@RequestBody Student student){
        return service.addStudent(student);
    }

    @PutMapping("/mentor")
    public Mentor updateMentor(@RequestBody Mentor mentor){
        return service.addMentor(mentor);
    }

    @DeleteMapping("/mentor")
    public void deleteMentor(@RequestBody Mentor mentor){
        service.deleteMentor(mentor.getId());
    }

    @DeleteMapping("/student")
    public void deleteStudent(@RequestBody Student student){
        service.deleteStudent(student.getId());
    }

    @DeleteMapping("/solution")
    public void deleteSolution(@RequestBody Solution solution){
        service.deleteSolution(solution.getId());
    }

    @DeleteMapping("/homework")
    public void deleteHomework(@RequestBody Homework homework){
        service.deleteHomework(homework.getId());
    }

}
