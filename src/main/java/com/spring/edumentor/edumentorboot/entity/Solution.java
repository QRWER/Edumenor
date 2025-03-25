package com.spring.edumentor.edumentorboot.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "solution")
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "photo", columnDefinition = "bytea[]")
    private byte[] photo;

    @Column(name = "time_end")
    private Timestamp timeEnd;

    public Solution(Integer id, byte[] photo, Timestamp timeEnd) {
        this.id = id;
        this.photo = photo;
        this.timeEnd = timeEnd;
    }

    public Solution(byte[] photo) {
        this.photo = photo;
        this.timeEnd = new Timestamp(new Date().getTime());
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

    public Timestamp getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(Timestamp timeEnd) {
        this.timeEnd = timeEnd;
    }

    @Override
    public String toString() {
        return "Solution{" +
                "id=" + id +
                ", timeEnd=" + timeEnd +
                '}';
    }
}
