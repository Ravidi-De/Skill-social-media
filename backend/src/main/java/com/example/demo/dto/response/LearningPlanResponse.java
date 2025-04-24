package com.example.demo.dto.response;

import com.example.demo.model.LearningPlanStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LearningPlanResponse {

    private String id;
    private String userId;
    private String title;
    private List<String> topics;
    private List<String> resources;
    private LocalDate startDate;
    private LocalDate endDate;
    private LearningPlanStatus status;
}
