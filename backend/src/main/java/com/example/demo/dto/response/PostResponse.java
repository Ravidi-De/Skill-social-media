package com.example.demo.dto.response;

import com.example.demo.model.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {

    private String postId;
    private Date postDate;
    private String description;
    private List<String> imageUrls;
    private String videoUrl;
    private String username;
    private int likeCount;
    private ArrayList<Comment> comments;
}
