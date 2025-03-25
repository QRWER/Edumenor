package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "homework")
public class Homework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_mentor")
    private Integer idMentor;

    @Column(name = "id_student")
    private Integer idStudent;

    @Column(name = "task")
    private byte[] task;

    @Column(name = "id_solution")
    private Integer idSolution;

    @Column(name = "review")
    private String review;

    @Column(name = "time_start")
    private Timestamp timeStart;

    public Homework() {
    }

    public Homework(Integer idMentor, Integer idStudent, byte[] task) {
        this.idMentor = idMentor;
        this.idStudent = idStudent;
        this.task = task;
        this.idSolution = null;
        this.review = null;
        this.timeStart = new Timestamp(new Date().getTime());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdMentor() {
        return idMentor;
    }

    public void setIdMentor(Integer idMentor) {
        this.idMentor = idMentor;
    }

    public Integer getIdStudent() {
        return idStudent;
    }

    public void setIdStudent(Integer idStudent) {
        this.idStudent = idStudent;
    }

    public byte[] getTask() {
        return task;
    }

    public void setTask(byte[] task) {
        this.task = task;
    }

    public Integer getIdSolution() {
        return idSolution;
    }

    public void setIdSolution(Integer idSolution) {
        this.idSolution = idSolution;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Timestamp getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(Timestamp timeStart) {
        this.timeStart = timeStart;
    }



    @Override
    public String toString() {
        return "Homework{" +
                "id=" + id +
                ", idMentor=" + idMentor +
                ", idStudent=" + idStudent +
                ", task=" + Arrays.toString(task) +
                ", idSolution=" + idSolution +
                ", review='" + review + '\'' +
                ", timeStart=" + timeStart +
                '}';
    }
}
