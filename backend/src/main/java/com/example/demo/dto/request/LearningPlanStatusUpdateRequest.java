package com.example.demo.dto.request;

import com.example.demo.model.LearningPlanStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LearningPlanStatusUpdateRequest {

    private String postId;
    private LearningPlanStatus status;

}
