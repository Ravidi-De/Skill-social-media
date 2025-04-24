package com.example.demo.service;

import com.example.demo.dto.response.FollowResponse;
import com.example.demo.exception.AllReadyExistsException;
import com.example.demo.exception.NotFoundException;

import java.util.List;

public interface FollowService {

    void followUser(String followerId, String targetUserId) throws NotFoundException, AllReadyExistsException;
    void unfollowUser(String followerId, String targetUserId) throws NotFoundException;
    List<FollowResponse> getAllFollowers(String userId) throws NotFoundException;
    List<FollowResponse> getAllFollowing(String userId) throws NotFoundException;
}
