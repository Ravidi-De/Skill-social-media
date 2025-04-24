package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String username;
    private String imgUrl;
    // List of followers and following
    private List<FollowInfo> followers = new ArrayList<>();
    private List<FollowInfo> following = new ArrayList<>();

}
