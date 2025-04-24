package com.example.demo.service;

import com.example.demo.dto.request.LearningProgressRequest;
import com.example.demo.dto.request.UpdateLearningProgressRequest;
import com.example.demo.dto.response.LearningProgressResponse;
import com.example.demo.exception.NotFoundException;

import java.util.List;

public interface LearningProgressService {

    LearningProgressResponse createLearningProgress(LearningProgressRequest learningProgressRequest) throws NotFoundException;
    List<LearningProgressResponse> getLearningProgressByUserId(String userId) throws NotFoundException;
    LearningProgressResponse updateLearningProgress( String postId ,UpdateLearningProgressRequest updateLearningProgressRequest) throws NotFoundException;
    String deleteLearningProgress(String postId) throws NotFoundException;

}
