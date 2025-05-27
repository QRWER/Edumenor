package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.Mentor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MentorDAO implements DAO<Mentor>{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Mentor> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("From Mentor", Mentor.class).getResultList();
    }

    @Override
    public Mentor getById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        return session.get(Mentor.class, id);
    }

    @Override
    public Mentor save(Mentor obj) {
        Session session = entityManager.unwrap(Session.class);
        session.merge(obj);
        return obj;
    }

    @Override
    public void deleteById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        session.remove(getById(id));
    }
}
