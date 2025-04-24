package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {

    @Id
    String postId;
    @DBRef
    private User user;
    Date postDate;
    String description;
    ArrayList<String> imageUrls = new ArrayList<>(3);
    String videoUrl;
    @DBRef
    private List<User> likedBy = new ArrayList<>();
    @DBRef
    private ArrayList<Comment> comments = new ArrayList<>();


}
