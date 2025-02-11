package com.a207.smartlocker.exception.custom;

public class LockerAlreadyInUseException extends RuntimeException {
    public LockerAlreadyInUseException(String message) {
        super(message);
    }
}
