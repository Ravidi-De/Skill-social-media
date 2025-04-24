package com.example.demo.controller;

import com.example.demo.dto.request.CommentRequest;
import com.example.demo.dto.request.PostRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.exception.AllReadyExistsException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.service.PostService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@AllArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping("/post")
    public PostResponse createPost(@RequestBody PostRequest postRequest) throws AllReadyExistsException {
        return postService.createPost(postRequest);
    }

    @DeleteMapping("/post")
    public String deletePost(@RequestParam String postId,@RequestParam String userId) throws NotFoundException {
        return postService.deletePost(postId,userId);
    }

    @PutMapping("/post")
    public PostResponse updatePost(@RequestParam String postId,String userId,@RequestBody PostRequest postRequest) throws NotFoundException {
        return postService.updatePost(postId,userId,postRequest);
    }



    @GetMapping("/feed")
    public List<PostResponse> getAllPosts() {
        return postService.getAllPosts();
    }
}
