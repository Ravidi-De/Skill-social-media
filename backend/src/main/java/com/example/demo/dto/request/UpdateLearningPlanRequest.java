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
public class UpdateLearningPlanRequest {

    private String title;
    private List<String> topics;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate endDate;

}
