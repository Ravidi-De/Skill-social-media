package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "learning_plan")
@Data
public class LearningPlan {

    @Id
    private String id;

    private String userId;
    private String title;
    private List<String> topics;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate endDate;
    private LearningPlanStatus status;

}
