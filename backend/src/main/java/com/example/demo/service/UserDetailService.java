package com.example.demo.service;

import com.example.demo.exception.NotFoundException;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserDetailService {

    UserDetails loadUserByUsername(String username) throws NotFoundException;
}
