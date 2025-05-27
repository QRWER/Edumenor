package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "review")
public class Review {
    @Id
    @Column
    private int id;

    @Column(name = "body_review")
    private String text;

    @Column(name = "time_create")
    private Timestamp timeCreate;

    public Review() {
    }

    public Review(int id, String text) {
        this.id = id;
        this.text = text;
        this.timeCreate = new Timestamp(new Date().getTime());
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Timestamp getTimeCreate() {
        return timeCreate;
    }

    public void setTimeCreate(Timestamp timeCreate) {
        this.timeCreate = timeCreate;
    }
}
