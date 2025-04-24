package com.example.demo.dto.request;

import com.example.demo.model.LearningPlanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LearningPlanRequest {

    private String userId;
    private String title;
    private List<String> topics;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate endDate;
    private LearningPlanStatus status;
}
