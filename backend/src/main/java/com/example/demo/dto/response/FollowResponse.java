package com.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FollowResponse {
    String userId;
    String name;
    String imgUrl;
}
