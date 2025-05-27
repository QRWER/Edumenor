package com.spring.edumentor.edumentorboot.dao;

import java.util.List;

public interface DAO<T> {
    public List<T> getAll();
    public T getById(Integer id);
    public T save(T obj);
    public void deleteById(Integer id);
}
