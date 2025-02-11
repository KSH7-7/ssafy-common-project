package com.a207.smartlocker.exception.handler;

import com.a207.smartlocker.exception.ErrorResponse;
import com.a207.smartlocker.exception.custom.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND); // 404
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED); // 401
    }

    @ExceptionHandler(RobotControlException.class)
    public ResponseEntity<ErrorResponse> handleRobotControlException(RobotControlException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE); // 503
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTokenException(InvalidTokenException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN); // 403
    }

    @ExceptionHandler(NoAvailableRobotException.class)
    public ResponseEntity<ErrorResponse> handleNoAvailableRobotException(NoAvailableRobotException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE); // 503
    }

    @ExceptionHandler(LockerAlreadyInUseException.class)
    public ResponseEntity<ErrorResponse> handleLockerAlreadyInUseException(LockerAlreadyInUseException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE); // 503
    }

    @ExceptionHandler(TaskAlreadyInQueueException.class)
    public ResponseEntity<ErrorResponse> handleTaskAlreadyInQueueException(TaskAlreadyInQueueException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE); // 503
    }
}
