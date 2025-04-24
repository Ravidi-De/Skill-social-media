package com.example.demo.service.impl;

import com.example.demo.dto.response.FollowResponse;
import com.example.demo.exception.AllReadyExistsException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.FollowInfo;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FollowService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.NotAcceptableStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class FollowServiceImpl implements FollowService {

    private UserRepository userRepository;

    @Override
    public void followUser(String followerId, String targetUserId) throws NotFoundException, AllReadyExistsException {

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + followerId));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + targetUserId));

        if(follower != null && targetUser != null) {

            List<FollowInfo> followingList = follower.getFollowing();
            List<FollowInfo> followerList = targetUser.getFollowers();

            // Check is already follow
            boolean isAlreadyFollowing = follower.getFollowing().stream()
                    .anyMatch(info -> info.getUserId().equals(targetUser.getId()));

            if(isAlreadyFollowing) {
                throw new AllReadyExistsException("Already following this user!");
            }

            // Add followings, followers user details
            followingList.add(mapToFollowInfo(targetUser));
            followerList.add(mapToFollowInfo(follower));

            // Save follower and targetUser
            userRepository.save(follower);
            userRepository.save(targetUser);
        }
    }

    @Override
    public void unfollowUser(String followerId, String targetUserId) throws NotFoundException {

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new NotAcceptableStatusException("User not found with id: " + followerId));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + targetUserId));

        if(follower != null && targetUser != null) {

            List<FollowInfo> followingList = follower.getFollowing();
            List<FollowInfo> followerList = targetUser.getFollowers();

            // Remove user details from the user follow info
            followingList.remove(mapToFollowInfo(targetUser));
            followerList.remove(mapToFollowInfo(follower));
            // Save users
            userRepository.save(follower);
            userRepository.save(targetUser);
        }
    }

    @Override
    public List<FollowResponse> getAllFollowers(String userId) throws NotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        return user.getFollowers().stream().map(this::mapToFollowResponse).toList();
    }

    @Override
    public List<FollowResponse> getAllFollowing(String userId) throws NotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        return user.getFollowing().stream().map(this::mapToFollowResponse).toList();
    }

    private FollowInfo mapToFollowInfo(User user) {
        FollowInfo followInfo = new FollowInfo();
        // Set follower details
        followInfo.setUserId(user.getId());
        followInfo.setName(user.getName());
        followInfo.setImgUrl(user.getImgUrl());

        return followInfo;
    }

    private FollowResponse mapToFollowResponse(FollowInfo userFollowInfo) {
        return FollowResponse.builder()
                .userId(userFollowInfo.getUserId())
                .name(userFollowInfo.getName())
                .imgUrl(userFollowInfo.getImgUrl())
                .build();
    }
}
