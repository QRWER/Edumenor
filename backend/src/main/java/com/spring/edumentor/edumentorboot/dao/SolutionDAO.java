package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.Solution;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SolutionDAO implements DAO<Solution>{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Solution> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("From Solution ", Solution.class).getResultList();
    }

    @Override
    public Solution getById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        return session.get(Solution.class, id);
    }

    @Override
    public Solution save(Solution obj) {
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
