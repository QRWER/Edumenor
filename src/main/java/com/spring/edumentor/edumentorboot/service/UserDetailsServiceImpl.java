package com.spring.edumentor.edumentorboot.service;

import com.spring.edumentor.edumentorboot.dao.UserDAO;
import com.spring.edumentor.edumentorboot.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserDAO userDAO;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDAO.getByUsername(username);
        if(user == null)
            throw new UsernameNotFoundException("User with username = " + username + " not found");
        return user;
    }
}
