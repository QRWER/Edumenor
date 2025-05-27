package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "solution")
public class Solution {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "photo", columnDefinition = "bytea[]")
    private byte[] photo;

    @Column(name = "time_create")
    private Timestamp timeCreate;

    public Solution(Integer id, byte[] photo) {
        this.id = id;
        this.photo = photo;
        this.timeCreate = new Timestamp(new Date().getTime());
    }

    public Solution(byte[] photo) {
        this.photo = photo;
        this.timeCreate = new Timestamp(new Date().getTime());
    }

    public Solution() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public Timestamp getTimeCreate() {
        return timeCreate;
    }

    public void setTimeCreate(Timestamp timeEnd) {
        this.timeCreate = timeEnd;
    }

    @Override
    public String toString() {
        return "Solution{" +
                "id=" + id +
                ", timeEnd=" + timeCreate +
                '}';
    }
}
