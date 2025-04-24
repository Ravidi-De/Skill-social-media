package com.example.demo.dto.request;

import lombok.Data;

import java.time.LocalDate;
@Data
public class UpdateLearningProgressRequest {

    private String skill;
    private String level;
    private String description;

}
