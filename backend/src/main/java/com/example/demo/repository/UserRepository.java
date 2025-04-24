package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
   Optional<User> findByUsernameAndPassword(String username, String password);
    User findByUsername(String username);
    User findByEmail(String email);
}
