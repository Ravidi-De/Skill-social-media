package com.example.demo.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class LearningProgressResponse {

    private String id;
    private String userId;
    private String skill;
    private String level;
    private String description;
    private LocalDate date;

}
