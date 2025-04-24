package com.example.demo.service.impl;

import com.example.demo.dto.response.MotivationMessageResponse;
import com.example.demo.service.AiService;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.service.OpenAiService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AiServiceImpl implements AiService {

    private final OpenAiService openAiService;

    @Override
    @Scheduled(fixedDelay = 60000)
    public MotivationMessageResponse getMotivationMessage() {

        CompletionRequest request = CompletionRequest.builder()
                .model("gpt-3.5-turbo-instruct")
                .prompt("Give a short and inspiring motivational quote for someone who hasn't studied in 10 days.")
                .maxTokens(60)
                .temperature(0.9)
                .build();

        String message = openAiService.createCompletion(request)
                .getChoices()
                .get(0)
                .getText()
                .trim();

        return new MotivationMessageResponse(message);
    }
}
