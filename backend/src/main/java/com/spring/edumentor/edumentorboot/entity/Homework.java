package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

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

    @Column(name = "time_create")
    private Timestamp timeCreate;

    public Homework() {
    }

    public Homework(Integer id, Integer idMentor, Integer idStudent, byte[] task) {
        this.id = id;
        this.idMentor = idMentor;
        this.idStudent = idStudent;
        this.task = task;
        this.timeCreate = new Timestamp(new Date().getTime());
    }

    public Homework(Integer idMentor, Integer idStudent, byte[] task) {
        this.idMentor = idMentor;
        this.idStudent = idStudent;
        this.task = task;
        this.timeCreate = new Timestamp(new Date().getTime());
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

    public Timestamp getTimeCreate() {
        return timeCreate;
    }

    public void setTimeCreate(Timestamp timeStart) {
        this.timeCreate = timeStart;
    }



    @Override
    public String toString() {
        return "Homework{" +
                "id=" + id +
                ", idMentor=" + idMentor +
                ", idStudent=" + idStudent +
                ", task=" + Arrays.toString(task) +
                ", timeStart=" + timeCreate +
                '}';
    }
}
