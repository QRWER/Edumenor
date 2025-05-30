package com.spring.edumentor.edumentorboot.service;

import com.spring.edumentor.edumentorboot.dao.*;
import com.spring.edumentor.edumentorboot.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ServiceImpl {

    @Autowired
    private MentorDAO mentorDAO;
    @Autowired
    private HomeworkDAO homeworkDAO;
    @Autowired
    private SolutionDAO solutionDAO;
    @Autowired
    private StudentDAO studentDAO;
    @Autowired
    private ReviewDAO reviewDAO;

    @Transactional
    public List<Mentor> getAllMentors() {
        return mentorDAO.getAll();
    }

    @Transactional
    public List<Student> getAllStudents(){
        return studentDAO.getAll();
    }

    @Transactional
    public List<Student> getStudentByName(String name){
        return studentDAO.getByName(name);
    }

    @Transactional
    public List<Homework> getAllHomework(){
        return homeworkDAO.getAll();
    }

    @Transactional
    public List<Homework> getAllHomeworkForMentor(Integer id){
        return homeworkDAO.getAllForMentor(id);
    }

    @Transactional
    public List<Homework> getAllHomeworkForStudent(Integer id){
        return homeworkDAO.getAllForStudent(id);
    }

    @Transactional
    public Homework getHomeworkById(Integer id){
        return homeworkDAO.getById(id);
    }

    @Transactional
    public Solution getSolution(Integer id){
        Solution solution = solutionDAO.getById(id);
        return solution;
    }

    @Transactional
    public Review getReviewById(Integer id){
        Review review = reviewDAO.getById(id);
        return review;
    }

    @Transactional
    public Homework addHomework(Homework homework){
        return homeworkDAO.save(homework);
    }

    @Transactional
    public Solution addSolution(Solution solution){
        return solutionDAO.save(solution);
    }

    @Transactional
    public Student addStudent(Student student) {
        return studentDAO.save(student);
    }

    @Transactional
    public Student getStudentById(int id) {
        return studentDAO.getById(id);
    }

    @Transactional
    public Mentor getMentorById(int id) {
        return mentorDAO.getById(id);
    }

    @Transactional
    public Mentor addMentor(Mentor mentor){
        return mentorDAO.save(mentor);
    }

    @Transactional
    public Review addReview(Review review) {
        return reviewDAO.save(review);
    }

    @Transactional
    public void deleteMentor(int id){
        mentorDAO.deleteById(id);
    }

    @Transactional
    public void deleteStudent(int id){
        studentDAO.deleteById(id);
    }

    @Transactional
    public void deleteSolution(int id){
        solutionDAO.deleteById(id);
    }

    @Transactional
    public void deleteHomework(int id){
        homeworkDAO.deleteById(id);
    }

    @Transactional
    public void deleteReview(int id){
        reviewDAO.deleteById(id);
    }
}
