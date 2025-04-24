package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "learning_progress")
@Data
public class LearningProgress {

    @Id
    private String id;

    private String userId;
    private String skill;
    private String level;
    private String description;
    private LocalDate date;
}
