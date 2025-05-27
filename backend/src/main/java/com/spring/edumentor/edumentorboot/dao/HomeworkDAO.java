package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.Homework;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HomeworkDAO implements DAO<Homework> {


    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Homework> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("From Homework", Homework.class).getResultList();
    }

    @Override
    public Homework getById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        return session.get(Homework.class, id);
    }

    @Override
    public Homework save(Homework obj) {
        Session session = entityManager.unwrap(Session.class);
        session.merge(obj);
        return obj;
    }

    @Override
    public void deleteById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        session.remove(getById(id));
    }

    public List<Homework> getAllForMentor(Integer id){
        Session session = entityManager.unwrap(Session.class);
        Query query = session.createQuery("From Homework where idMentor = :id", Homework.class);
        query.setParameter("id", id);
        List <Homework> all = query.getResultList();
        return all;

    }

    public List<Homework> getAllForStudent(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        Query query = session.createQuery("From Homework where idStudent = :id", Homework.class);
        query.setParameter("id", id);
        List<Homework> all = query.getResultList();
        return all;
    }
}
