package com.example.demo.service.impl;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.exception.AllReadyExistsException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public UserResponse registerUser(UserRequest userRequest) throws AllReadyExistsException {
        // Validate user email and username
        validateUserRequest(userRequest);

        User user = new User();
        //Set user details
        setUserDetails(user, userRequest);

        userRepository.save(user);

        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToUserResponse).toList();
    }

    @Override
    public UserResponse updateUser(String userId, UserRequest userRequest) throws NotFoundException, AllReadyExistsException {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));
        // Validate user email and username
        validateUserRequest(userRequest);
        // Set updated details
        setUserDetails(existingUser, userRequest);
        // Set image
        if(userRequest.getImgUrl() != null && !userRequest.getImgUrl().isEmpty()) {
            existingUser.setImgUrl(userRequest.getImgUrl());
        }
        // Save user
        userRepository.save(existingUser);

        return mapToUserResponse(existingUser);
    }

    @Override
    public void deleteUser(String userId) throws NotFoundException {

        User exsitingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + userId));

        userRepository.delete(exsitingUser);
    }

    @Override
    public LoginResponse loginUser(LoginRequest loginRequest) throws NotFoundException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String jwt = jwtUtil.generateToken(userDetails);

        User foundUser = userRepository.findByUsername(loginRequest.getUsername());

        if (foundUser == null){
            throw new NotFoundException("User not found with username: " + loginRequest.getUsername());
        }

        return LoginResponse.builder()
                .id(foundUser.getId())
                .name(foundUser.getName())
                .email(foundUser.getEmail())
                .username(foundUser.getUsername())
                .token(jwt)
                .build();
    }

    private void validateUserRequest(UserRequest userRequest) throws AllReadyExistsException{

        User existsUserByUsername = userRepository.findByUsername(userRequest.getUsername());
        User existsUserByEmail = userRepository.findByEmail(userRequest.getEmail());

        if(existsUserByUsername != null){
            throw new AllReadyExistsException("User already exists with username: " + userRequest.getUsername());
        }

        if(existsUserByEmail != null){
            throw new AllReadyExistsException("User already exists with email: " + userRequest.getEmail());
        }
    }

    private void setUserDetails(User user, UserRequest userRequest){
        if(userRequest.getName() != null)
            user.setName(userRequest.getName());
        if(userRequest.getEmail() != null)
            user.setEmail(userRequest.getEmail());
        if(userRequest.getUsername() != null)
            user.setUsername(userRequest.getUsername());
        if (userRequest.getPassword() != null)
            user.setPassword(passwordEncoder.encode(userRequest.getPassword())); // Password encode
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .username(user.getUsername())
                .imgUrl(user.getImgUrl())
                .followers(user.getFollowers())
                .following(user.getFollowing())
                .build();
    }
}
