package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.Student;
import com.spring.edumentor.edumentorboot.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.hibernate.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class UserDAO implements DAO<User> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("From User ", User.class).getResultList();
    }

    public User getByUsername(String username){
        Session session = entityManager.unwrap(Session.class);
        Query query = session.createQuery("From User where username = :newUsername", User.class);
        query.setParameter("newUsername", username);
        List<User> user = query.getResultList();
        return user.isEmpty()?null:user.get(0);
    }

    @Override
    public User getById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        return session.get(User.class, id);
    }

    @Override
    public User save(User obj) {
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
