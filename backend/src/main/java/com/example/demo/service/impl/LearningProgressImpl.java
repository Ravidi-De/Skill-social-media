package com.example.demo.service.impl;

import com.example.demo.dto.request.LearningProgressRequest;
import com.example.demo.dto.request.UpdateLearningProgressRequest;
import com.example.demo.dto.response.LearningProgressResponse;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.LearningProgress;
import com.example.demo.model.User;
import com.example.demo.repository.LearningProgressRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.LearningProgressService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class LearningProgressImpl implements LearningProgressService {

    private LearningProgressRepository learningProgressRepository;
    private UserRepository userRepository;

    @Override
    public LearningProgressResponse createLearningProgress(LearningProgressRequest learningProgressRequest) throws NotFoundException {

        Optional<User> userOptional = userRepository.findById(learningProgressRequest.getUserId());

        if (!userOptional.isPresent()){
            throw new NotFoundException("user not found with id : " + learningProgressRequest.getUserId());
        }

        LearningProgress learningProgress = new LearningProgress();

        learningProgress.setUserId(learningProgressRequest.getUserId());
        learningProgress.setSkill(learningProgressRequest.getSkill());
        learningProgress.setLevel(learningProgressRequest.getLevel());
        learningProgress.setDescription(learningProgressRequest.getDescription());
        learningProgress.setDate(LocalDate.now());

        LearningProgress savedLearningProgress = learningProgressRepository.save(learningProgress);


        return LearningProgressResponse.builder()
                .id(savedLearningProgress.getId())
                .userId(savedLearningProgress.getUserId())
                .skill(savedLearningProgress.getSkill())
                .level(savedLearningProgress.getLevel())
                .description(savedLearningProgress.getDescription())
                .date(savedLearningProgress.getDate())
                .build();
    }

    @Override
    public List<LearningProgressResponse> getLearningProgressByUserId(String userId) throws NotFoundException {
        List<LearningProgress> learningProgressList = learningProgressRepository.findLearningProgressByUserId(userId);

        if (learningProgressList.isEmpty()) {
            throw new NotFoundException("No learning progress entries found for user id: " + userId);
        }

        List<LearningProgressResponse> responseList = new ArrayList<>();

        for (LearningProgress progress : learningProgressList) {
            LearningProgressResponse response = LearningProgressResponse.builder()
                    .id(progress.getId())
                    .userId(progress.getUserId())
                    .skill(progress.getSkill())
                    .level(progress.getLevel())
                    .description(progress.getDescription())
                    .date(progress.getDate())
                    .build();
            responseList.add(response);
        }

        return responseList;
    }

    @Override
    public LearningProgressResponse updateLearningProgress(String postId, UpdateLearningProgressRequest updateLearningProgressRequest) throws NotFoundException {

        Optional<LearningProgress> optionalLearningProgress = learningProgressRepository.findById(postId);

        if (!optionalLearningProgress.isPresent()){
            throw new NotFoundException("post not found with id : " + postId);
        }

        LearningProgress foundLearningProgress = optionalLearningProgress.get();

        foundLearningProgress.setSkill(updateLearningProgressRequest.getSkill());
        foundLearningProgress.setLevel(updateLearningProgressRequest.getLevel());
        foundLearningProgress.setDescription(updateLearningProgressRequest.getDescription());
        foundLearningProgress.setDate(LocalDate.now());

        LearningProgress updatedLearningProgress = learningProgressRepository.save(foundLearningProgress);

        return LearningProgressResponse.builder()
                .id(foundLearningProgress.getId())
                .userId(foundLearningProgress.getUserId())
                .skill(updatedLearningProgress.getSkill())
                .level(updatedLearningProgress.getLevel())
                .description(updatedLearningProgress.getDescription())
                .date(updatedLearningProgress.getDate())
                .build();
    }

    @Override
    public String deleteLearningProgress(String postId) throws NotFoundException {

        Optional<LearningProgress> optionalLearningProgress = learningProgressRepository.findById(postId);

        if (!optionalLearningProgress.isPresent()){
            throw new NotFoundException("post not found with id : " + postId);
        }

        learningProgressRepository.deleteById(postId);

        return "post deleted successfull with id : " + postId;
    }
}
