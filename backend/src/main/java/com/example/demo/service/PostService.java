package com.example.demo.service;

import com.example.demo.dto.request.CommentRequest;
import com.example.demo.dto.request.PostRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PostResponse;

import java.util.List;

public interface PostService {

    PostResponse createPost(PostRequest postRequest);

    String deletePost(String postId,String userId);

    PostResponse updatePost(String postId, String userId,PostRequest updateRequest);

    String addComment(String postId,CommentRequest commentRequest);

    CommentResponse updateComment(String postId, String userId, String commentId, CommentRequest req);

    void deleteComment(String postId,String commentId,String userId);

    List<PostResponse> getAllPosts();

}
