package com.spring.edumentor.edumentorboot.dao;

import com.spring.edumentor.edumentorboot.entity.Student;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class StudentDAO implements DAO<Student> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Student> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("From Student ", Student.class).getResultList();
    }

    @Override
    public Student getById(Integer id) {
        Session session = entityManager.unwrap(Session.class);
        return session.get(Student.class, id);
    }

    public List<Student> getByName(String name) {
        name = "%" + name.toLowerCase() + "%";
        Session session = entityManager.unwrap(Session.class);
        Query query = session.createQuery("from Student where lower(fullName) like :name ", Student.class);
        query.setParameter("name", name);
        List<Student> students = query.getResultList();
        return students;
    }

    @Override
    public Student save(Student obj) {
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
