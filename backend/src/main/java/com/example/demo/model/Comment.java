package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "comments")
@Data
public class Comment {
    @Id
    String commentId;
    @CreatedDate
    Date commentedDate;
    String comment;
    @DBRef
    private User user;
    String postId;
}
