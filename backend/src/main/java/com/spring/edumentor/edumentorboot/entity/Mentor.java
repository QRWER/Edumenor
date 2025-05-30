package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "mentor")
public class Mentor {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "subject")
    private String subject;

    @Column(name = "education")
    private String education;

    public Mentor() {
    }

    public Mentor(int id, String fullName, String subject, String education) {
        this.id = id;
        this.fullName = fullName;
        this.subject = subject;
        this.education = education;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    @Override
    public String toString() {
        return "Mentor{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", subject='" + subject + '\'' +
                ", education='" + education + '\'' +
                '}';
    }
}
