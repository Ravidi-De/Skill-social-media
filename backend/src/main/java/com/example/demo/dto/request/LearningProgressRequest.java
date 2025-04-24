package com.example.demo.dto.request;

import lombok.Data;

import java.time.LocalDate;
@Data
public class LearningProgressRequest {

    private String id;
    private String userId;
    private String skill;
    private String level;
    private String description;

}
