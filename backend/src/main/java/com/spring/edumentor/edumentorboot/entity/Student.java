package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "school")
    private String school;

    public Student() {
    }

    public Student(int id, String fullName, String school) {
        this.id = id;
        this.fullName = fullName;
        this.school = school;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", school='" + school + '\'' +
                '}';
    }
}
