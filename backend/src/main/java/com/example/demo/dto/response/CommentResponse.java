package com.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class CommentResponse {

    private String commentId;
    private String comment;
    private Date commentedDate;
    private String postId;
    private String userId;
}
