package com.example.demo.exception;

public class MissingRequiredValueException extends Exception{
    public MissingRequiredValueException(String message) {
        super(message);
    }
}
