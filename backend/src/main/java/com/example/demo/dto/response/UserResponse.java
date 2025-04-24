package com.example.demo.dto.response;

import com.example.demo.model.FollowInfo;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String username;
    private String imgUrl;
    @Builder.Default
    private List<FollowInfo> followers = new ArrayList<>();
    @Builder.Default
    private List<FollowInfo> following = new ArrayList<>();
}
