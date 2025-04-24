package com.example.demo.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class PostRequest {

    private String description;
    private List<String> imageUrls;
    private String videoUrl;
    private String userId;
}
