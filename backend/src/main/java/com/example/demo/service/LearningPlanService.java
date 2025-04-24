package com.example.demo.service;

import com.example.demo.dto.request.LearningPlanRequest;
import com.example.demo.dto.request.LearningPlanStatusUpdateRequest;
import com.example.demo.dto.request.UpdateLearningPlanRequest;
import com.example.demo.dto.response.LearningPlanResponse;
import com.example.demo.exception.NotFoundException;

import java.util.List;

public interface LearningPlanService {

    LearningPlanResponse createLearningPlan(LearningPlanRequest learningPlanRequest) throws NotFoundException;
    LearningPlanResponse updateLearningPlanStatus(LearningPlanStatusUpdateRequest learningPlanStatusUpdateRequest) throws NotFoundException;
    LearningPlanResponse updateLearningPlan(UpdateLearningPlanRequest updateLearningPlanRequest , String postId) throws NotFoundException;
    List<LearningPlanResponse> getAllLearningPlanByUserId(String userId)throws NotFoundException;
    String deleteLearningPlanById(String postId)throws NotFoundException;
}
