package com.a207.smartlocker.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RobotTaskResponse {
    private boolean success;
    private String message;
}