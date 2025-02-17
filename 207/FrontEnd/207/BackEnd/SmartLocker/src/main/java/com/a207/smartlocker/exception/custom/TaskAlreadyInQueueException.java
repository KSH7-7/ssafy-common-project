package com.a207.smartlocker.exception.custom;

public class TaskAlreadyInQueueException extends RuntimeException {
    public TaskAlreadyInQueueException(String message) {
        super(message);
    }
}
