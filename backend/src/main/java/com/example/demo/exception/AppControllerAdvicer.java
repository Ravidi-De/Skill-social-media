package com.example.demo.exception;

import com.example.demo.dto.response.CustomErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AppControllerAdvicer {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    public CustomErrorResponse handleNotFoundException(Exception e){

        CustomErrorResponse errorResponse = new CustomErrorResponse();
        errorResponse.setMessage(e.getMessage());

        return errorResponse;
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(AllReadyExistsException.class)
    public CustomErrorResponse handleAllReadyExistsException(Exception e){

        CustomErrorResponse errorResponse = new CustomErrorResponse();
        errorResponse.setMessage(e.getMessage());

        return errorResponse;
    }
}
