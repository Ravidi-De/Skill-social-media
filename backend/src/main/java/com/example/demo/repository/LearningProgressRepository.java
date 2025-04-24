package com.example.demo.repository;

import com.example.demo.model.LearningProgress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LearningProgressRepository extends MongoRepository<LearningProgress , String> {

   List<LearningProgress> findLearningProgressByUserId(String userId);
}
