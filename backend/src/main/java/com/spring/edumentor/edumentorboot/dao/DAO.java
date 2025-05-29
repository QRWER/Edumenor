package com.spring.edumentor.edumentorboot.dao;

import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface DAO<T> {
    public List<T> getAll();
    public T getById(Integer id);
    public T save(T obj);
    public void deleteById(Integer id);
}
