package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.Homework;
import com.spring.edumentor.edumentorboot.entity.Mentor;
import com.spring.edumentor.edumentorboot.entity.Review;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class ReviewDAO implements DAO<Review>{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Review> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("From Review ", Review.class).getResultList();
    }

    @Override
    public Review getById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        return session.get(Review.class, id);
    }

    @Override
    public Review save(Review obj) {
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
